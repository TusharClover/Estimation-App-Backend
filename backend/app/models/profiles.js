const mysql = require('mysql2/promise');

const pool = require('../config/db');

getAllProfiles = async(req) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM profiles');
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};



module.exports = { getAllProfiles };