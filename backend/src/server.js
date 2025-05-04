const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./db');
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const port = 5005;

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

connectDB();

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

// app.get('/api/product/search/:keywords', (req, res) => {
//     const keyword = req.params.keywords.toLowerCase();
//     filteredProducts = [];
//     products.forEach(p => {
//         if (p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword)) {
//             filteredProducts.push(p);
//             console.log('Product found:', filteredProducts[filteredProducts.length - 1].name); // Log the found product
//         }
//         else {
//             console.log('Product not found:', p.name); // Log the not found product

//         }
//     }
//     )
//     if (filteredProducts) {
//         console.log(filteredProducts.length + ' Product found');
//         res.json(filteredProducts);
//     } else {
//         res.status(404).json({ error: 'Product not found' });
//     }
// });

// Start the server
app.listen(port, async () => {
  console.log(`Backend API is running on http://localhost:${port}`);
});