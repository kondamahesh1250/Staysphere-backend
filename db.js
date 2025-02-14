require("dotenv").config();
const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);  // Stop execution due to failure
    }
};

module.exports = connectDB;
