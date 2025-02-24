const mysql = require('mysql2/promise');

const pool = require('../config/db');

createEstimation = async(req) => {
    try {
        const [rows] = await pool.execute('INSERT INTO estimations (client_name,project_name,received_on,prepared_by,reviewed_by,technology,currency_of_revenue,unit_of_estimation,userid) VALUES ("' + req.client_name + '","' + req.project_name + '","' + req.received_on + '","' + req.prepared_by + '","' + req.reviewed_by + '","' + req.technology + '","' + req.currency_of_revenue + '","' + req.unit_of_estimation + '","' + req.userid + '")');
        return rows;
    } catch (error) {
        throw error;
    }
};

getEstimationsByUserId = async(req) => {
    // console.log(req, "request params");
    let user_id = req.id;
    try {
        const [rows] = await pool.execute('SELECT * FROM estimations WHERE userid = ' + user_id + ' ORDER BY id DESC');
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};



getEstimationsById = async(req) => {
    // console.log(req.id);
    let id = req.id;
    try {
        const [rows] = await pool.execute('SELECT * FROM estimations WHERE id = ' + id);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};


updateEstimationById = async(req) => {
    console.log(req.body);
    var param = req.body;
    try {
        const [rows] = await pool.execute('UPDATE estimations SET client_name = "' + param.client_name + '", project_name = "' + param.project_name + '",received_on = "' + param.received_on + '",prepared_by = "' + param.prepared_by + '",technology = "' + param.technology + '",currency_of_revenue = "' + param.currency_of_revenue + '", userid = ' + param.userid + ' WHERE id = ' + param.id + ';');
        // console.log(rows);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};

getEstimationByUserId = async(req) => {
    // console.log(req.id);
    let id = req.id;
    try {
        const [rows] = await pool.execute('SELECT DISTINCT e.* FROM estimations e INNER JOIN estimation_proposed_schedules ep ON e.id = ep.estimation_id WHERE e.userid = ' + id);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};

deleteEstimationById = async(req) => {
    // console.log(req.id);
    let id = req.id;
    try {
        // Start a transaction
        // await pool.execute('START TRANSACTION');

        // Delete dependent records in estimation_project_phases
        await pool.execute('DELETE FROM estimation_project_phases WHERE estimation_id = ?', [id]);

        // Delete dependent records in development_efforts
        await pool.execute('DELETE FROM development_efforts WHERE estimation_id = ?', [id]);

        // Now delete from estimations
        const [result] = await pool.execute('DELETE FROM estimations WHERE id = ?', [id]);

        // Commit the transaction
        // await pool.execute('COMMIT');

        return result.affectedRows > 0; // Return true if deletion was successful
    } catch (error) {
        // await pool.execute('ROLLBACK'); // Rollback on error
        throw error; // Re-throw for handling in the controller
    }
};


module.exports = { createEstimation, getEstimationsByUserId, getEstimationsById, updateEstimationById, getEstimationByUserId, deleteEstimationById };