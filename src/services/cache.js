import mongoose from 'mongoose';
import util from 'util';
import redis from 'redis';

import { cacheLogger, cacheStatusLogger, cacherErrorLogger } from '../utils/logger.js';

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, {
    no_ready_check: true,
});

// client.auth(process.env.REDIS_PASSWORD, (err) => {
//     if (err) console.log(err);
// });

client.on('error', (err) => {
    cacherErrorLogger({ err });
});

client.on('connect', () => {
    cacheStatusLogger({ message: process.env.REDIS_HOST });
});

client.get = util.promisify(client.get);

const { exec } = mongoose.Query.prototype;

// This function allows you to use the cache, if you dont want to use the cache,
// dont put this function in the controllers
mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.cacheExpiration = options.exp || 60 * 14 + 30;
    this.redisKey = JSON.stringify(options.key || 'key');
    return this;
};

// Function to overwirte mongoose Query function - cannot be arrow function
// ______________________________________________________________________________\\
//     Change here if you want to use cache in dev                          \\
mongoose.Query.prototype.exec = async function () {
    // Check to see if above chace function is called or if env is dev
    if (!this.useCache || process.env.NODE_ENV !== 'production') {
        // if (!this.useCache) {
        return exec.apply(this, arguments); // eslint-disable-line
    }

    const startTime = new Date();

    // Check Redis to see if there is a value for the key
    const cacheValue = await client.get(this.redisKey);

    // If data is in redis, return cache data
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        const endTime = new Date() - startTime;
        cacheLogger({ type: 'CACHE', redisKey: this.redisKey, endTime });

        return doc;
    }

    // If not in cache, issue the query to mongoDB, then store results in redis cache
    const result = await exec.apply(this, arguments); // eslint-disable-line

    client.set(this.redisKey, JSON.stringify(result), 'EX', this.cacheExpiration);

    const endTime = new Date() - startTime;
    cacheLogger({ type: 'MongoDB', redisKey: this.redisKey, endTime });

    return result;
};
