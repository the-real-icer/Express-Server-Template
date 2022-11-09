import crypto from 'crypto';
import mongoose from 'mongoose';
// import validator from 'validator'
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
        address: {
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            street_address: {
                type: String,
            },
            zip_code: {
                type: String,
            },
        },
        date_created: {
            type: Date,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            // validate: [validator.isEmail, 'Please provide a valid email']
        },
        first_name: {
            type: String,
            default: '',
        },
        last_name: {
            type: String,
            default: '',
        },
        last_visit: { type: Date },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            // This line stops the password from being sent out from the DB
            select: false,
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        phone_number: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['user'],
            default: 'user',
            required: true,
        },
        tracking_info: {
            ip_address: {
                type: String,
            },
            website_visit_source: {
                type: String,
            },
            original_landing_page: {
                type: String,
            },
        },
        user_id: {
            type: String,
            required: true,
            unique: true,
        },
        user_location: {
            city: { type: String },
            coordinates: {
                lat: { type: String },
                lng: { type: String },
            },
            geo_coords: {
                type: {
                    type: String,
                    enum: ['Point'],
                },
                coordinates: {
                    type: [Number],
                },
            },
            state: { type: String },
            zip: { type: String },
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// This middleware hashes passwords and sends them to the database
userSchema.pre('save', async function (next) {
    // Quick check to see if password has not changed and just exit function
    if (!this.isModified('password')) return next();

    if (!this.password) return next();
    // 12 is good number to make safe hashes

    this.password = await bcrypt.hash(this.password, 12);
    // This deletes the password confirm so it is not sent to DB after validation
    // this.passwordConfirm = undefined;
    return next();
});

// This updates the password Changed At property to current updated time
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    return next();
});

// Middleware to go before all find functions
userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

// This middleware checks a hashed DB password with an
// inputted password to see if they are the same and log a user in
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
};

// Checks to see if a user has changed their password after Token is issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// creates a temp password token with built in crypto function
// - must be required above, but not npm installed
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
