const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const connectDB = require('./db');

const fs = require('fs').promises;
const cors = require('cors'); // To allow requests from the frontend
const app = express();
app.use(bodyParser.json());

const port = 5005;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/carts', cartRoutes);
app.use('/reviews', reviewRoutes);
connectDB();

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});