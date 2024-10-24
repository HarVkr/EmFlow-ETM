const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const URI = process.env.MONGO_DB_CONNECTION_STRING;

const connectDB = async () => {
    try {
        await mongoose.connect(URI).then(() => {
            console.log("MongoDB connected.");
        })
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;