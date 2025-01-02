const mysql = require('mysql2/promise');

const pool = require('../config/db');

getAllSites = async(req) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM sites');
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};



module.exports = { getAllSites };