const express = require('express');
const app = express();
const port = 5005;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from server!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
