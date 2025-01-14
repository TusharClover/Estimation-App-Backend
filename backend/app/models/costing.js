const mysql = require('mysql2/promise');

const pool = require('../config/db');

createCosting = async(req) => {
    try {
        const [rows] = await pool.execute(
            `INSERT INTO costing (profile_id, site_id, estimation_id, rate_pd, cost_pd, expected_margin, actual_margin, efforts, expenses) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                req.profile_id,
                req.site_id,
                req.estimation_id,
                req.rate_pd,
                req.cost_pd,
                req.expected_margin,
                req.actual_margin,
                req.efforts,
                req.expenses
            ]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};


getCostingById = async(req) => {
    // console.log(req.id);
    let id = req.id;
    try {
        const [rows] = await pool.execute('SELECT * FROM costing WHERE id = ' + id);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};


module.exports = { createCosting, getCostingById };