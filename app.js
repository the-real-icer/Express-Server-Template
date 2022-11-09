// 3rd Party Packages
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Custom Packages
import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

// Routers
import userRouter from './routes/userRoutes.js';

// Mongo DB
import './services/database.js';

// Redis Cache
import './services/cache.js';

const app = express();

// Global Middlewares

// Set Security Http Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Set CORS Headers
app.use((req, res, next) => {
    // Change Line Below if you want to restrict access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.status(200).json({
            status: 'success',
        });
    } else {
        next();
    }
});

// Rate Limiter
// This limits the amount of requests from the same IP address to 100 per hour
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '2mb' }));

// Compression
app.use(compression());

// Data Santization against NoSQL query injection
app.use(mongoSanitize());

// Data Santization against XSS
app.use(xss());

app.use(express.urlencoded({ extended: false }));

// Quick Home Page to test functionality
app.get('/', (req, res) => {
    res.send('Server Home Page');
});

// Routes
app.use('/api/v1/users', userRouter);

// Catch-All Error Route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error Handling Middleware
app.use(globalErrorHandler);

export default app;
