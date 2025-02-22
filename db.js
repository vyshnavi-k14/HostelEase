const mysql = require('mysql');

// Create MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'hostel'
});

// Export the pool
module.exports = pool;
