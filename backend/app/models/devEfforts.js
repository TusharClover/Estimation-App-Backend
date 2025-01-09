const mysql = require('mysql2/promise');

const pool = require('../config/db');

createDevEfforts = async(req) => {
    console.log(req, "request");
    try {
        // Extracting the array of data to be inserted
        const { efforts } = { "efforts": req.tasks }; // `efforts` is expected to be an array of objects
        console.log(efforts, "efforts");
        if (!Array.isArray(efforts) || efforts.length === 0) {
            throw new Error("No data provided for bulk insert");
        }

        // Construct the values part of the query
        const values = efforts.map(effort => `(
            "${effort.task_name}",
            "${effort.complexity}",
            ${effort.count},
            ${effort.unit_efforts},
            ${effort.estimated_efforts},
            ${effort.estimation_id}
        )`).join(',');

        // SQL Query
        const query = `
            INSERT INTO development_efforts (
                task_name,
                complexity,
                count,
                unit_efforts,
                estimated_efforts,
                estimation_id
            ) VALUES ${values}
        `;
        const [deletedRows] = await pool.execute('DELETE FROM development_efforts WHERE estimation_id = ' + req.estimation_id);
        console.log(deletedRows, "delete result");
        // Execute the query
        if (deletedRows) {
            const [rows] = await pool.execute(query);
            return rows;
        }
    } catch (error) {
        throw error;
        // return false;
    }
};

getDevEffortsById = async(req) => {
    // console.log(req.id);
    let id = req.id;
    try {
        const [rows] = await pool.execute('SELECT * FROM development_efforts WHERE estimation_id = ' + id);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};

deleteDevEffortById = async(req) => {
    // console.log(req.id);
    let id = req.id;
    try {
        const [rows] = await pool.execute('DELETE FROM development_efforts WHERE id = ' + id);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};

updateDevEffortById = async(req) => {
    // console.log(req.body);
    var param = req.body;
    try {
        const [rows] = await pool.execute('UPDATE development_efforts SET task_name = "' + param.task_name + '", complexity = "' + param.complexity + '",count = ' + param.count + ',unit_efforts = ' + param.unit_efforts + ',estimated_efforts = ' + param.estimated_efforts + ',estimation_id = ' + param.estimation_id + ' WHERE id = ' + param.id + ';');
        // console.log(rows);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};

getTotalCountOfDevEffortsByEstId = async(req) => {
    // console.log(req);
    let id = req.estimation_id;
    try {
        const [rows] = await pool.execute('SELECT SUM(estimated_efforts) AS total_estimated_efforts FROM development_efforts WHERE estimation_id = ' + id);
        return rows[0].total_estimated_efforts || 0;
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};




module.exports = { createDevEfforts, getDevEffortsById, deleteDevEffortById, updateDevEffortById, getTotalCountOfDevEffortsByEstId };