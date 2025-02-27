const mysql = require('mysql2/promise');

const pool = require('../config/db');

createCosting = async(req) => {
    console.log(req, "request");
    try {
        // Extracting the array of data to be inserted
        const { costings } = { "costings": req.costings }; // `costings` is expected to be an array of objects
        console.log(costings, "costings");
        if (!Array.isArray(costings) || costings.length === 0) {
            throw new Error("No data provided for bulk insert");
        }

        // Construct the values part of the query
        const values = costings.map(costing => `(
            "${costing.profile_id}",
            "${costing.site_id}",
            "${costing.estimation_id}",
            ${costing.rate_pd},
            ${costing.cost_pd},
            ${costing.expected_margin},
            ${costing.actual_margin},
            ${costing.efforts},
            ${costing.expenses}
        )`).join(',');

        // SQL Query
        const query = `
            INSERT INTO costing (
                profile_id,
                site_id,
                estimation_id,
                rate_pd,
                cost_pd,
                expected_margin,
                actual_margin,
                efforts,
                expenses
            ) VALUES ${values}
        `;

        const [deletedRows] = await pool.execute('DELETE FROM costing WHERE estimation_id = ' + req.estimation_id);
        console.log(deletedRows, "delete result");
        // Execute the query
        if (deletedRows) {
            const [rows] = await pool.execute(query);
            return rows;
        }

    } catch (error) {
        throw error;
    }
};


getCostingById = async(req) => {
    // console.log(req.id);
    let id = req.id;
    try {
        const [rows] = await pool.execute(`SELECT c.*, p.profile_name AS profile_name, s.name AS site_name FROM costing c JOIN profiles p ON c.profile_id = p.id JOIN sites s ON c.site_id = s.id WHERE c.estimation_id = ${id};`);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};


insertEstimationStatus = async(req) => {
    try {
        const [rows] = await pool.execute('INSERT INTO estimation_status (estimation_id,status,remark,prepared_by,reviewed_by) VALUES (' + req.estimation_id + ',"' + req.status + '","' + req.remark + '","' + req.prepared_by + '","' + req.reviewed_by + '")');
        return rows;
    } catch (error) {
        throw error;
    }
};

updateEstimationStatus = async(req) => {
    try {
        const [rows] = await pool.execute(
            'UPDATE estimation_status SET status = "' + req.status + '", remark = "' + req.remark + '", prepared_by = "' + req.prepared_by + '", reviewed_by = "' + req.reviewed_by + '" WHERE estimation_id = ' + req.estimation_id
        );
        return rows;
    } catch (error) {
        throw error;
    }
};


module.exports = { createCosting, getCostingById, insertEstimationStatus, updateEstimationStatus };