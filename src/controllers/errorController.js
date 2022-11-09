import AppError from '../utils/appError.js';

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate Field Value: ${value}. Please use another value.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // For Operational, Trusted Errors - Send Message to Client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

        // For programming or other unknown error - Don't Send Error Details
    } else {
        // Log Error to Console
        console.error('Error - ', err);

        // Generic Message sent to client
        res.status(500).json({
            status: 'error',
            message: 'Sorry, something went wrong',
        });
    }
};

const handleJWTError = () => new AppError('Invalid token. Please login again.', 401);
const erMsg = 'Your token has expired. Please login again.';
const handleJWTExpiredError = () => new AppError(erMsg, 401);

// eslint-disable-next-line
export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // eslint-disable-line
    err.status = err.status || 'error'; // eslint-disable-line

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    } else {
        // NOT SURE WHY THIS IS HAPPENING
        sendErrorProd(err, res);
    }
};
