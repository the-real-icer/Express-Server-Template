import 'dotenv/config.js';
import chalk from 'chalk';
import app from './app.js';

// Safety Net to catch errors and restart application -
// Must be located above any other function code due to order of operations
if (process.env.NODE_ENV === 'production') {
    process.on('uncaughtException', (err) => {
        console.log(chalk.red('UNCAUGHT EXCEPTION! SHUTTING DOWN!'));
        console.log(err.name, err.message);
        process.exit(1);
    });
} else {
    process.on('uncaughtException', (err) => {
        console.log(chalk.red('UNCAUGHT EXCEPTION! SHUTTING DOWN!'));
        console.log(err.name, err.message, err.stack);
        process.exit(1);
    });
}

console.log('----------------------');
console.log('Application is in');
console.log(chalk.blue.bold(app.get('env')));
console.log('----------------------');

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(chalk.green(`App is running on port ${PORT}`));
});

// Safety Catch All to catch Unhandled Rejections
process.on('unhandledRejection', (err) => {
    console.log(chalk.red('UNHANDLED REJECTION! SHUTTING DOWN!'));
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
