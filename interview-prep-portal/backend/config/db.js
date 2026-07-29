const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interview-portal');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n====================================================================`);
    console.error(`MONGODB CONNECTION WARNING:`);
    console.error(`${error.message}`);
    console.error(`Please update the MONGO_URI in 'backend/.env' with your MongoDB Atlas Free Tier connection string.`);
    console.error(`====================================================================\n`);
  }
};

module.exports = connectDB;
