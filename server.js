const express = require('express');

const hostname = '127.0.0.1';
const port = 3000;

// Create Express application instance
const app = express();

// Route handler for root path - returns "Hello, World!" message
app.get('/', (req, res) => {
  res.type('text/plain').send('Hello, World!\n');
});

// Route handler for /evening path - returns "Good evening" message
app.get('/evening', (req, res) => {
  res.type('text/plain').send('Good evening');
});

// Start the server and listen on configured hostname and port
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
