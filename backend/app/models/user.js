const mysql = require('mysql2/promise');
const pool = require('../config/db');
const Buffer = require('buffer').Buffer;


const login = async(req) => {
    // console.log(req);
    var user = JSON.parse(Buffer.from(req.body.user, 'base64').toString());
    // console.log(user, "inside model");

    try {
        const [rows] = await pool.execute('SELECT id,employee_id,employee_name,employee_grade FROM users WHERE employee_id="' + user.username + '" AND password="' + user.password + '"');
        // console.log(rows);
        if (rows.length > 0) {
            // Return the user details including the user ID
            const user = rows[0]; // Assuming there's only one matching row
            console.log(user);
            return {
                success: true,
                user: user
            };
        } else {
            return { success: false }; // Return false if credentials are incorrect
        }
    } catch (error) {
        // console.error('Error creating user:', error);
        throw error; // Re-throw for handling in the controller
    }
};



getAllReviewers = async(req) => {
    try {
        const [rows] = await pool.execute('SELECT id,employee_id,employee_name,employee_grade FROM users WHERE employee_grade="M4"');
        return rows; // Return true if users successfully
    } catch (error) {
        throw error; // Re-throw for handling in the controller
    }
};



module.exports = { login, getAllReviewers };