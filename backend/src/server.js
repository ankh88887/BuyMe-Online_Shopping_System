const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const connectDB = require('./db');
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const port = 5005;

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);

connectDB();

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

// Start the server
app.listen(port, async () => {
  console.log(`Backend API is running on http://localhost:${port}`);
});