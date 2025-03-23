require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.u650a.mongodb.net/?appName=Cluster0`); 
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;