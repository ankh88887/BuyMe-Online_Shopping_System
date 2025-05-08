require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/BuyMe', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(async () => {
        console.log('MongoDB Connected');
      })
      .catch(err => {
        console.error('Database connection error:', err);
      });
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;