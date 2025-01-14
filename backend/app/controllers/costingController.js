const Costing = require('../models/costing');
const jwt = require('jsonwebtoken');
// const logger = require('../logs/logger');

// Assume these environment variables are properly set
const secretKey = process.env.SECRET_KEY; // Access token secret key
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET; // Refresh token secret key


const createCosting = async(req, res) => {

    const header = req.headers['authorization'];

    if (header) {

        const headersArr = header.split(',');

        const accessToken = headersArr[0].split(' ')[1];
        const refreshToken = headersArr[1].split(' ')[2];

        if (!accessToken) {
            return res.status(404).send({ error: 'Please check access token' });
        }

        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                return res.status(404).send({ error: 'User is not authenticated' });
            }

            // If verification succeeds, proceed to get employees
            const result = await Costing.createCosting(req.body);
            if (result) {
                return res.status(200).send({ message: 'Costing created successfully!', result: result.insertId, success: true });
            } else {
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: 0, success: false });
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    return res.status(404).send({ error: 'Please check refresh token' });
                }

                try {
                    // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        return res.status(404).send({ error: 'User is not authenticated' });
                    }

                    const result = await Costing.createCosting(req.body);
                    if (result) {
                        return res.status(200).send({ message: 'Costing created successfully!', result: result.insertId ? true : false, success: true });
                    } else {
                        console.log(result);
                        return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                    }
                } catch (refreshErr) {
                    console.log(refreshErr, "resfresh Error");
                    return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                }
            } else {
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }
    } else {
        return res.status(404).send({ error: 'Headers not added properly' });
    }
};

const getCostingById = async(req, res) => {
    // console.log(req);
    const header = req.headers['authorization'];
    if (header) {
        const headersArr = header.split(',');

        // console.log(headersArr);

        const accessToken = headersArr[0].split(' ')[1];
        const refreshToken = headersArr[1].split(' ')[2];

        if (!accessToken) {
            // logger.error('No access token provided');
            return res.status(404).send({ error: 'Please check access token' });
        }
        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                // logger.error('User not authorized');
                return res.status(404).send({ error: 'User is not authenticated' });
            }

            const result = await Costing.getCostingById(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'Costing fetch successfully!', result: result[0], success: true });
            } else {
                // logger.error('Failed to get Estimation');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
            }
        } catch (err) {
            // console.log('inside catch');
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    // logger.error('No refresh token provided');
                    return res.status(404).send({ error: 'Please check refresh token' });
                }

                try { // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        // logger.error('User not authorized');
                        return res.status(404).send({ error: 'User is not authenticated' });
                    }

                    // console.log(authData);

                    const result = await Costing.getCostingById(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'Costing fetch successfully! with a new access token!',
                            result: result[0],
                            success: true
                        });
                    } else {
                        // logger.error('No employees found');
                        return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                    }
                } catch (refreshErr) {
                    console.log(refreshErr, "resfresh Error");
                    return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                }
            } else {
                // logger.error('Invalid access token');
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }

    } else {
        return res.status(404).send({ error: 'Headers not added properly' });
    }
};

module.exports = { createCosting, getCostingById };