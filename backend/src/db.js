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

        // Get the database object
        const db = mongoose.connection.db;

        // List all collections in the database
        const collections = await db.listCollections().toArray();
        console.log('Collections in the database:', collections.map(col => col.name));

        // Print all data for each collection
        for (const collection of collections) {
          const data = await db.collection(collection.name).find({}).toArray();
          console.log(`Data in collection "${collection.name}":`, data);
        }
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