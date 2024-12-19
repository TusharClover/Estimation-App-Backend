const mysql = require('mysql2/promise');
const pool = require('../config/db');
const Buffer = require('buffer').Buffer;


const login = async(req) => {
    // console.log(req);
    var user = JSON.parse(Buffer.from(req.body.user, 'base64').toString());
    // console.log(user, "inside model");

    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE employee_id="' + user.username + '" AND password="' + user.password + '"');
        // console.log(rows);
        if (rows.length > 0) {
            // Return the user details including the user ID
            const user = rows[0]; // Assuming there's only one matching row
            return {
                success: true,
                user_id: user.id
            };
        } else {
            return { success: false }; // Return false if credentials are incorrect
        }
    } catch (error) {
        // console.error('Error creating user:', error);
        throw error; // Re-throw for handling in the controller
    }
};


const getAll = async(req, res) => {
    console.log(req, res);
}


module.exports = { login, getAll };