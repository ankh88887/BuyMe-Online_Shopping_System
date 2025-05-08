const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const connectDB = require('./db');

const fs = require('fs').promises;
const cors = require('cors'); // To allow requests from the frontend
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const port = 5005;

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/admin', adminRoutes);
app.use('/userinfo', userProfileRoutes);

connectDB();

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});