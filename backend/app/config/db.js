const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Admin$123',
    database: process.env.DB_NAME || 'estimation_db'
});

module.exports = pool;