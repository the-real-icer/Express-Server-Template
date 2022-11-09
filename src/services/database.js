import mongoose from 'mongoose';
import { databaseLogger } from '../utils/logger.js';

// Import Any Models That you need Here
// import yelpLocaleSchema from '../models/yelpLocaleSchema.js';

const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    poolSize: 10,
};

mongoose.connect(process.env.MONGO_URL, mongooseOptions).then(() => {
    databaseLogger({ color: 'blue', message: 'connected to DB!' });
});

mongoose.connection.on('error', (err) => {
    databaseLogger({ color: 'red', message: `DB connection error: ${err.message}` });
});

// Connection for Models
// const yelpDBConn = mongoose.createConnection(process.env.MONGO_URL, mongooseOptions);
// export const yelpDBConnModel = yelpDBConn.model('YelpLocale', yelpLocaleSchema);
