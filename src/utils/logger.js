import chalk from 'chalk';

export const cacheLogger = (options) => {
    console.log(
        chalk.green.bold(
            `'___________${options.type} ${options.endTime} ms______________ redisKey: ${options.redisKey}'`
        )
    );
};

export const databaseLogger = (options) => {
    // eslint-disable-next-line
    options.color === 'blue'
        ? console.log(chalk.blue.bold(options.message))
        : console.log(chalk.red(options.message));
};

export const serverErrorLogger = (options) => {
    console.log(chalk.red(options.message));
    console.log(options.err.name, options.err.message);
    options.dev && console.log(err.stack); // eslint-disable-line
};

export const serverStatusLogger = (options) => {
    console.log('-------------------------------');
    console.log('');
    console.log('Application is in');
    console.log(chalk.blue.bold(options.message));
    console.log('');
    console.log('----------------------');
};

export const serverPortLogger = (options) => {
    console.log(chalk.green(`App is running on port ${options.message}`));
};
