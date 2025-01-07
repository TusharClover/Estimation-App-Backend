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

// getCostingBasedOnRateCardByEstId = async(req) => {
//     var estimation_id = req.estimation_id;
//     try {
//         const [rows] = await pool.execute(`SELECT eps.site_id,eps.site_name,eps.profile_id,eps.profile_name,eps.schedule_order,eps.estimation_id,COALESCE(SUM(w.days_count), 0) AS total_days_count,rc.margin,rc.rate_pd,rc.cost_pd FROM estimation_proposed_schedules eps LEFT JOIN weeks w ON eps.id = w.proposed_schedule_id LEFT JOIN rate_card rc ON eps.site_id = rc.site_id AND eps.profile_id = rc.profile_id WHERE eps.estimation_id = ` + estimation_id + ` GROUP BY eps.id,rc.id;`);
//         return rows; // Return true if users successfully
//     } catch (error) {
//         throw error; // Re-throw for handling in the controller
//     }
// };


getCostingBasedOnRateCardByEstId = async(req) => {
    var estimation_id = req.estimation_id;
    try {
        const [rows] = await pool.execute(`SELECT eps.site_id, eps.site_name, eps.profile_id, eps.profile_name, rc.rate_pd, rc.cost_pd, COUNT(DISTINCT eps.id) AS number_of_items_merged, SUM(eps.schedule_order) AS total_schedule_order, eps.estimation_id, COALESCE(SUM(w.days_count), 0) AS total_days_count, AVG(rc.margin) AS average_margin FROM estimation_proposed_schedules eps LEFT JOIN weeks w ON eps.id = w.proposed_schedule_id LEFT JOIN rate_card rc ON eps.site_id = rc.site_id AND eps.profile_id = rc.profile_id WHERE eps.estimation_id = ` + estimation_id + ` GROUP BY eps.site_id, eps.site_name, eps.profile_id, eps.profile_name, rc.rate_pd, rc.cost_pd, eps.estimation_id;
`);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};


module.exports = { getAllRateCard, getAllRateCardByEstId, getCostingBasedOnRateCardByEstId };