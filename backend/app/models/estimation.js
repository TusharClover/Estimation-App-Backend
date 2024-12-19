const mysql = require('mysql2/promise');

const pool = require('../config/db');

createEstimation = async(req) => {
    try {
        const [rows] = await pool.execute('INSERT INTO estimations (client_name,project_name,received_on,prepared_by,technology,currency_of_revenue,userid) VALUES ("' + req.client_name + '","' + req.project_name + '","' + req.received_on + '","' + req.prepared_by + '","' + req.technology + '","' + req.currency_of_revenue + '","' + req.userid + '")');
        return rows;
    } catch (error) {
        throw error;
    }
};

getEstimationsByUserId = async(req) => {
    // console.log(req, "request params");
    let user_id = req.id;
    try {
        const [rows] = await pool.execute('SELECT * FROM estimations WHERE userid = ' + user_id);
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


module.exports = { createEstimation, getEstimationsByUserId, getEstimationsById, updateEstimationById };