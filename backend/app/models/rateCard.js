const mysql = require('mysql2/promise');

const pool = require('../config/db');

getAllRateCard = async(req) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM rate_card');
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};

getAllRateCardByEstId = async(req) => {
    var estimation_id = req.estimation_id;
    try {
        const [rows] = await pool.execute('SELECT rc.* FROM rate_card rc JOIN (SELECT profile_id, site_id FROM estimation_proposed_schedules WHERE estimation_id = ' + estimation_id + ') eps ON rc.profile_id = eps.profile_id AND rc.site_id = eps.site_id;');
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};


module.exports = { getAllRateCard, getAllRateCardByEstId };