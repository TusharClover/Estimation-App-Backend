const mysql = require('mysql2/promise');

const pool = require('../config/db');

getAllClients = async(req) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM clients');
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};



module.exports = { getAllClients };