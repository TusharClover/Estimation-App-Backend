const proposedSchedule = require('../models/proposedSchedule');
const jwt = require('jsonwebtoken');
// const logger = require('../logs/logger');

// Assume these environment variables are properly set
const secretKey = process.env.SECRET_KEY; // Access token secret key
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET; // Refresh token secret key

const createProposedScheduleByEstnId = async(req, res) => {
    // console.log(req, res);
    const header = req.headers['authorization'];

    if (header) {

        const headersArr = header.split(',');

        // console.log(headersArr);

        const accessToken = headersArr[0].split(' ')[1];
        const refreshToken = headersArr[1].split(' ')[2];

        if (!accessToken) {
            // logger.error('No access token provided');
            return res.status(404).send({ error: 'No access token provided' });
        }

        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                // logger.error('User not authorized');
                return res.status(404).send({ error: 'User not authorized' });
            }
            // If verification succeeds, proceed to get employees
            const result = await proposedSchedule.createProposedScheduleByEstnId(req.body);
            if (result) {
                // logger.info('Estimations created successfully!');
                res.status(200).send({ message: 'proposedSchedule created successfully!', result: result[0], success: true });
            } else {
                // logger.error('Failed to create Estimations');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    // logger.error('No refresh token provided');
                    return res.status(404).send({ error: 'No refresh token provided' });
                }

                try { // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        // logger.error('User not authorized');
                        return res.status(404).send({ error: 'User not authorized' });
                    }
                    const result = await proposedSchedule.createProposedScheduleByEstnId(req.body);
                    if (result) {
                        // logger.info('Estimations created successfully! with a new access token!');
                        return res.status(200).send({ message: 'proposedSchedule created successfully! with a new access token!', result: result[0], success: true });
                    } else {
                        // logger.error('No Estimations found');
                        return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                    }
                } catch (refreshErr) {
                    // console.log(refreshErr);
                    // logger.error('Invalid refresh token');
                    return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                }
            } else {
                // console.log(err);
                // logger.error('Invalid access token');
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }


    } else {
        // logger.error('No access token provided');
        return res.status(404).send({ error: 'Headers not added properly' });
    }

};


const getProposedScheduleByEstnId = async(req, res) => {
    // console.log(req, res);
    const header = req.headers['authorization'];

    if (header) {

        const headersArr = header.split(',');

        // console.log(headersArr);

        const accessToken = headersArr[0].split(' ')[1];
        const refreshToken = headersArr[1].split(' ')[2];

        if (!accessToken) {
            // logger.error('No access token provided');
            return res.status(404).send({ error: 'No access token provided' });
        }

        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                // logger.error('User not authorized');
                return res.status(404).send({ error: 'User not authorized' });
            }
            // If verification succeeds, proceed to get employees
            const result = await proposedSchedule.getProposedScheduleByEstnId(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'proposedSchedule fetch successfully!', result: result, success: true });
            } else {
                // logger.error('Failed to get Estimation');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    // logger.error('No refresh token provided');
                    return res.status(404).send({ error: 'No refresh token provided' });
                }

                try { // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        // logger.error('User not authorized');
                        return res.status(404).send({ error: 'User not authorized' });
                    }
                    const result = await proposedSchedule.getProposedScheduleByEstnId(req.params);
                    if (result) {
                        // logger.info('Estimation fetch successfully!');
                        res.status(200).send({ message: 'proposedSchedule fetch successfully!', result: result, success: true });
                    } else {
                        // logger.error('Failed to get Estimation');
                        return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                    }
                } catch (refreshErr) {
                    // console.log(refreshErr);
                    // logger.error('Invalid refresh token');
                    return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                }
            } else {
                // console.log(err);
                // logger.error('Invalid access token');
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }


    } else {
        // logger.error('No access token provided');
        return res.status(404).send({ error: 'Headers not added properly' });
    }


};


const updateProposedScheduleByEstnId = async(req, res) => {
    // console.log(req, res);
    const header = req.headers['authorization'];

    if (header) {

        const headersArr = header.split(',');

        // console.log(headersArr);

        const accessToken = headersArr[0].split(' ')[1];
        const refreshToken = headersArr[1].split(' ')[2];

        if (!accessToken) {
            // logger.error('No access token provided');
            return res.status(404).send({ error: 'No access token provided' });
        }

        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                // logger.error('User not authorized');
                return res.status(404).send({ error: 'User not authorized' });
            }
            // If verification succeeds, proceed to get employees
            const result = await proposedSchedule.updateProposedScheduleByEstnId(req.body);
            if (result) {
                // logger.info('Estimations created successfully!');
                res.status(200).send({ message: 'proposedSchedule created successfully!', result: result[0], success: true });
            } else {
                // logger.error('Failed to create Estimations');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    // logger.error('No refresh token provided');
                    return res.status(404).send({ error: 'No refresh token provided' });
                }

                try { // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        // logger.error('User not authorized');
                        return res.status(404).send({ error: 'User not authorized' });
                    }
                    const result = await proposedSchedule.updateProposedScheduleByEstnId(req.body);
                    if (result) {
                        // logger.info('Estimations created successfully! with a new access token!');
                        return res.status(200).send({ message: 'proposedSchedule created successfully! with a new access token!', result: result[0], success: true });
                    } else {
                        // logger.error('No Estimations found');
                        return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                    }
                } catch (refreshErr) {
                    // console.log(refreshErr);
                    // logger.error('Invalid refresh token');
                    return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                }
            } else {
                // console.log(err);
                // logger.error('Invalid access token');
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }


    } else {
        // logger.error('No access token provided');
        return res.status(404).send({ error: 'Headers not added properly' });
    }

};


module.exports = { createProposedScheduleByEstnId, getProposedScheduleByEstnId, updateProposedScheduleByEstnId };