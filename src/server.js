import 'dotenv/config.js';

import app from './app.js';
import { serverErrorLogger, serverStatusLogger, serverPortLogger } from './utils/logger.js';

// Safety Net to catch errors and restart application -
// Must be located above any other function code due to order of operations
if (process.env.NODE_ENV === 'production') {
    process.on('uncaughtException', (err) => {
        serverErrorLogger({ message: 'UNCAUGHT EXCEPTION! SHUTTING DOWN!', err });
        process.exit(1);
    });
} else {
    process.on('uncaughtException', (err) => {
        serverErrorLogger({ message: 'UNCAUGHT EXCEPTION! SHUTTING DOWN!', err, dev: true });
        process.exit(1);
    });
}

serverStatusLogger({ message: app.get('env') });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    serverPortLogger({ message: PORT });
});

// Safety Catch All to catch Unhandled Rejections
process.on('unhandledRejection', (err) => {
    serverErrorLogger({ message: 'UNHANDLED REJECTION! SHUTTING DOWN!', err });
    server.close(() => {
        process.exit(1);
    });
});
