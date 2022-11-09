import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

// _________________________Get A Unsubscribe User _________________ \\
// Get User Info - Used for Unsubscribe page - only pulls - saved searches & e Alerts
const getUserUnsubscribe = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Pull User from DB - Only selecting e-Alerts, Saved Searches & Email
    const user = await User.findOne({ user_id: id }).select(
        'e_alerts saved_searches user_id email'
    );

    // If No User Found - Send back error
    if (!user) {
        return next(new AppError("Sorry, we couldn't find that user. Please try again.", 404));
    }
    // Send The User
    return res.status(200).json({
        status: 'success',
        data: user,
    });
});

// _______________________________________________USER PROFILE___________________________________\\
// Allows Users to update their info
// eslint-disable-next-line
const updateMe = catchAsync(async (req, res, next) => {
    // Create error if user tries to update their password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates', 400));
    }

    // Filter out unwanted field names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'first_name', 'last_name', 'phone_number', 'email');
    // Update User info
    await User.findOneAndUpdate({ user_id: req.body.userId }, filteredBody, {
        new: true,
        runValidators: true,
    })
        .select('first_name last_name phone_number email')
        .exec((err, doc) => {
            if (err) {
                if (err.code === 11000) {
                    return next(
                        new AppError(
                            'This email address is already in use. Please use another email.',
                            403
                        )
                    );
                }
                return next(new AppError(err.message, 400));
            }

            if (!doc) {
                return next(
                    new AppError("Sorry, we couldn't find that user. Please try again.", 404)
                );
            }

            return res.status(201).json({
                status: 'success',
                data: {
                    user: doc,
                },
            });
        });
});

// Allow a user to delete their account
// Does not fully remove their account from database, just changes status to inactive
const deleteMe = catchAsync(async (req, res, next) => {
    await User.findOneAndUpdate({ user_id: req.query.userId }, { active: false }).exec(
        (err, doc) => {
            if (err) {
                return next(new AppError(err.message, 400));
            }

            if (!doc) {
                return next(
                    new AppError("Sorry, we couldn't find that user. Please try again.", 404)
                );
            }

            return res.status(204).json({
                status: 'success',
                data: null,
            });
        }
    );
});

const userController = {
    getUserUnsubscribe,
    updateMe,
    deleteMe,
};

export default userController;
