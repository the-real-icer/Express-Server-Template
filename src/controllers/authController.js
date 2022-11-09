import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid';/

import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import sendPasswordReset from '../emails/sendPasswordReset.js';

const restrictedFields = '-user_location -geo_coords -date_created -__v -role -active -address';
//

// Sign the JWT token with secret
const jwtSecret = process.env.JWT_SECRET;
const jwtOptions = {
    expiresIn: 30 * 60 * 60 * 24,
};
const signToken = (id) => jwt.sign({ id }, jwtSecret, jwtOptions);

// Create and send the JWT Token to the client
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);

    // Remove Password from output
    user.password = undefined; //eslint-disable-line

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

// Function to create a new user
// _________________________________REQUIRED USER ITEMS

const createNewUser = async ({ user, res, next }) => {
    const { user_id, email, password, tracking_info, firstName, lastName, imageUrl } = user;

    // Create a basic new user in DB and send to client as quickly as possible
    const newUser = new User({
        date_created: new Date(),
        email,
        first_name: firstName,
        last_visit: new Date(),
        last_name: lastName,
        password,
        tracking_info,
        user_id,
        imageUrl,
    });

    // Save this basic new user to DB
    await newUser.save();

    // TODO ---- Find if there is a better way to do this - seems like an unnecessary extra step
    // Get user from DB and populate favorite homes,
    // compared homes and agent assigned and send to client
    await User.findOne({ email })
        .select(restrictedFields)
        .exec((err, doc) => {
            if (err) {
                return next(new AppError(err.message, 400));
            }
            return createSendToken(doc, 200, res);
        });

    // Get user ipInfo
    const ipInfo = await axios.get(
        `http://api.ipstack.com/${tracking_info.ip_address}?access_key=${process.env.IP_STACK_KEY}&format=1`
    );

    const user_location = {
        city: ipInfo.data.city,
        state: ipInfo.data.region_code,
        zip: ipInfo.data.zip,
        coordinates: {
            lat: ipInfo.data.latitude,
            lng: ipInfo.data.longitude,
        },
    };

    if (ipInfo) {
        await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    user_location,
                    geo_coords: {
                        type: 'Point',
                        coordinates: [ipInfo.data.longitude, ipInfo.data.latitude],
                    },
                },
            }
        );
    }
};

// eslint-disable-next-line
const login = catchAsync(async (req, res, next) => {
    const { email, password, clientUser } = req.body;

    const { tracking_info, user_id, agent_assigned } = clientUser;

    // Check if email & password exist
    if (!email || !password) {
        return next(new AppError('Please provide email & password', 400));
    }

    // Check if user exists under this email address & the password is correct
    const user = await User.findOne({ email }).select('+password');

    if (user && !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // If all is correct with this user found via email, send token to client
    // Updates viewed & favorite homes with ones sent from client
    // There is Logic in Client to correct user_id & agent assigned in client if wrong
    if (user) {
        User.findOneAndUpdate(
            { email },
            {
                $set: {
                    last_visit: new Date(),
                },
            },
            { new: true }
        )
            .lean()
            .select(restrictedFields)
            .exec((err, doc) => {
                if (err) {
                    return next(new AppError(err.message, 400));
                }
                return createSendToken(doc, 200, res);
            });
    }

    // If no user exists for this email create a new user
    if (!user) {
        // const userIdExists = await User.findOne({ user_id }).select('+password');

        const newUser = {
            email,
            password,
            tracking_info,
            agent_assigned,
            firstName: '',
            lastName: '',
            imageUrl: '',
        };

        newUser.user_id = user_id;

        return createNewUser({ user: newUser, res, next });
    }
});

// ___________________Check that token is valid______________________\\
const checkToken = catchAsync(async (req, res, next) => {
    let token;

    // Get token and check if it exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // eslint-disable-line
    }
    if (!token) {
        return next(new AppError('You are not logged in. Please login', 401));
    }

    // Verify the Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Check that the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists', 401));
    }
    // Check if user changed password after JWT Token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Please login again.', 401));
    }

    return res.status(200).json({
        status: 'success',
        token,
    });
});

// ______________Protect Routes________________\\
// This function protects routes from being accessed by users that are not logged in & valid
const protect = catchAsync(async (req, res, next) => {
    let token;

    // Get token and check if it exists
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; //eslint-disable-line
    }
    if (!token) {
        return next(new AppError('You are not logged in. Please login', 401));
    }

    // Verify the Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Check that the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token no longer exists', 401));
    }
    // Check if user changed password after JWT Token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Please login again.', 401));
    }

    req.user = currentUser;
    return next();
});

// Restricts Routes to only certain user types
const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }
    return next();
};

const forgotPassword = catchAsync(async (req, res, next) => {
    // Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There was no user with that email address', 404));
    }
    // generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // Send it to user's email
    const resetURL = `${req.headers.origin}/reset-password/${resetToken}`;

    try {
        sendPasswordReset(user.email, resetURL);

        return res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
            data: resetToken,
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending the email. Please try again later', 500)
        );
    }
});

const resetPassword = catchAsync(async (req, res, next) => {
    // Get User Based on The Token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })
        .populate({
            path: 'agent_assigned',
            select: 'display_email email image name dre_license phone',
        })
        .select(restrictedFields);

    // If Token has not expired & There is a user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    // Update changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the user in & send JWT
    return createSendToken(user, 200, res);
});

// Function to let users update their password
const updatePassword = catchAsync(async (req, res, next) => {
    const { userId, passwordConfirm, newPassword } = req.body;

    // Get User from the DB
    const user = await User.findOne({ user_id: userId }).select('+password');

    // Check that the POSTed password is correct
    if (!(await user.correctPassword(req.body.passwordConfirm, user.password))) {
        return next(new AppError('Your current password is incorrect', 401));
    }

    // If password is correct, update it to new password
    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    // Log User In & send JWT
    return createSendToken(user, 201, res);
});

const authController = {
    login,
    checkToken,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
};

export default authController;
