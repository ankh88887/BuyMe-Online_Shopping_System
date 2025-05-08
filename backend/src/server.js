const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const adminRoutes = require('./routes/adminRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');


const connectDB = require('./db');
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const port = 5005;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

connectDB();

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

// Start the server
app.listen(port, async () => {
  console.log(`Backend API is running on http://localhost:${port}`);
});