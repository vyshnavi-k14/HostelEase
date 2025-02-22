const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const app = express();
const port = 3030;
const pool = require('./db');
const roomRoutes = require('./routes/roomRoutes');



// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory using serve-static
app.use(serveStatic(path.join(__dirname, 'public')));

// Use the room routes under the /api prefix
app.use('/api', roomRoutes);

// Default route to serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
      return;
    }
    console.log('Connected to MySQL database');
    connection.release();
  });
});
