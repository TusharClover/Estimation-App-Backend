const mysql = require('mysql2/promise');

const pool = require('../config/db');

getAllPhases = async(req) => {
    try {
        const [rows] = await pool.execute('SELECT id,default_percentage,phase_name AS name FROM project_phases;');
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};

getPhasesByEstimationId = async(req) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM estimation_project_phases WHERE estimation_id =' + req.estimation_id);
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};


createPhasesForEstimation = async(req) => {
    console.log(req, "request");
    try {
        // Extracting the array of data to be inserted
        const { phases } = { "phases": req }; // `efforts` is expected to be an array of objects
        console.log(phases, "phases");
        if (!Array.isArray(phases) || phases.length === 0) {
            throw new Error("No data provided for bulk insert");
        }

        // Construct the values part of the query
        const values = phases.map(phase => `(
            "${phase.phase_name}",
            ${phase.efforts},
            ${phase.default_percentage},
            ${phase.actual_efforts},
            ${phase.project_phase_id},
            ${phase.estimation_id}
        )`).join(',');

        // SQL Query
        const query = `
            INSERT INTO estimation_project_phases (
                phase_name,
                efforts,
                default_percentage,
                actual_efforts,
                project_phase_id,
                estimation_id
            ) VALUES ${values}
        `;

        // Execute the query
        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        throw error;
        // return false;
    }
};

module.exports = { getAllPhases, getPhasesByEstimationId, createPhasesForEstimation };