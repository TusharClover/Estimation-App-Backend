const Estimations = require('../models/estimation');
const jwt = require('jsonwebtoken');
// const logger = require('../logs/logger');

// Assume these environment variables are properly set
const secretKey = process.env.SECRET_KEY; // Access token secret key
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET; // Refresh token secret key


const createEstimation = async(req, res) => {

    const header = req.headers['authorization'];

    if (header) {

        const headersArr = header.split(',');

        const accessToken = headersArr[0].split(' ')[1];
        const refreshToken = headersArr[1].split(' ')[2];

        if (!accessToken) {
            return res.status(404).send({ error: 'Please check token' });
        }

        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                return res.status(404).send({ error: 'Please check token' });
            }

            // If verification succeeds, proceed to get employees
            const result = await Estimations.createEstimation(req.body);
            if (result) {
                res.status(200).send({ message: 'Estimations created successfully!', result: result.insertId ? true : false });
            } else {
                res.status(200).send({ error: 'Something went wrong, please check data properly' });
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    return res.status(404).send({ error: 'Please check token' });
                }

                try {
                    // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        return res.status(404).send({ error: 'Please check token' });
                    }

                    const result = await Estimations.createEstimation(req.body);
                    if (result) {
                        return res.status(200).send({ message: 'Estimations created successfully! with a new access token!', result: result.insertId ? true : false });
                    } else {
                        return res.status(200).send({ error: 'Something went wrong, please check data properly' });
                    }
                } catch (refreshErr) {
                    return res.status(404).send({ error: 'Please check token' });
                }
            } else {
                return res.status(404).send({ error: 'Please check token' });
            }
        }
    } else {
        return res.status(404).send({ error: 'Please check token' });
    }
};


const getEstimationsByUserId = async(req, res) => {
    // console.log(req, res);
    const header = req.headers['authorization'];
    if (header) {
        const headersArr = header.split(',');

        // console.log(headersArr);

        const accessToken = headersArr[0].split(' ')[1];
        const refreshToken = headersArr[1].split(' ')[2];

        if (!accessToken) {
            console.log('No access token provided');
            return res.status(404).send({ error: 'No access token provided' });
        }
        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                console.log('User not authorized');
                return res.status(404).send({ error: 'User not authorized' });
            }

            const result = await Estimations.getEstimationsByUserId(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'Estimation fetch successfully!', result: result });
            } else {
                // logger.error('Failed to get Estimation');
                res.status(404).send({ error: 'Failed to get Estimation' });
            }
        } catch (err) {
            console.log('inside catch', err);
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    console.log('No refresh token provided');
                    return res.status(404).send({ error: 'No refresh token provided' });
                }

                try { // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        // logger.error('User not authorized');
                        return res.status(404).send({ error: 'User not authorized' });
                    }

                    // console.log(authData);

                    const result = await Estimation.getEstimationsByUserId(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'Estimation fetch successfully! with a new access token!',
                            result: result
                        });
                    } else {
                        // logger.error('No employees found');
                        return res.status(404).send({ error: 'No estimation found' });
                    }
                } catch (refreshErr) {
                    console.log('Invalid refresh token');
                    return res.status(404).send({ error: 'Invalid refresh token Step 3' });
                }
            } else {
                console.log('Invalid access token');
                return res.status(404).send({ error: 'Invalid access token,Step 2' });
            }
        }

    } else {
        console.log('No access token provided,Step 1');
        return res.status(404).send({ error: 'No access token provided' });
    }
};

const getEstimationsById = async(req, res) => {
    // console.log(req);
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

            const result = await Estimations.getEstimationsById(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'Estimation fetch successfully!', result: result[0] });
            } else {
                // logger.error('Failed to get Estimation');
                res.status(404).send({ error: 'Failed to get Estimation' });
            }
        } catch (err) {
            // console.log('inside catch');
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

                    // console.log(authData);

                    const result = await Estimation.getEstimationsById(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'Estimation fetch successfully! with a new access token!',
                            result: result[0]
                        });
                    } else {
                        // logger.error('No employees found');
                        return res.status(404).send({ error: 'No estimation found' });
                    }
                } catch (refreshErr) {
                    // logger.error('Invalid refresh token');
                    return res.status(404).send({ error: 'Invalid refresh token' });
                }
            } else {
                // logger.error('Invalid access token');
                return res.status(404).send({ error: 'Invalid access token' });
            }
        }

    } else {
        // logger.error('No access token provided');
        return res.status(404).send({ error: 'No access token provided' });
    }
};

const updateEstimationById = async(req, res) => {

    // console.log(res);
    const header = req.headers['authorization'];

    if (header) {

        const headersArr = header.split(',');

        // console.log(headersArr);

        const accessToken = headersArr[0].split(' ')[1];
        const refreshToken = headersArr[1].split(' ')[2];

        if (!accessToken) {
            console.log('No access token provided');
            return res.status(404).send({ error: 'No access token provided' });
        }


        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                console.log('User not authorized');
                return res.status(404).send({ error: 'User not authorized' });
            }
            // If verification succeeds, proceed to get employees
            const result = await Estimations.updateEstimationById(req);
            console.log(result, "Result");
            if (result) {
                // logger.info('Employee fetch successfully!');
                res.status(200).send({ message: 'Estimations fetch successfully!', result: result[0] });
            } else {
                // logger.error('Failed to create employee');
                res.status(404).send({ error: 'Failed to create Estimations' });
            }
        } catch (err) {
            console.log(err.name, "Error Name");
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    console.log('No refresh token provided');
                    return res.status(404).send({ error: 'No refresh token provided' });
                }

                try { // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        // logger.error('User not authorized');
                        return res.status(404).send({ error: 'User not authorized' });
                    }
                    const result = await Estimations.updateEstimationById(req);
                    console.log(result, "error");
                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({ message: 'Estimations fetch successfully! with a new access token!', result: result[0] });
                    } else {
                        // logger.error('No employees found');
                        return res.status(404).send({ error: 'No Estimations found' });
                    }
                } catch (refreshErr) {
                    console.log(refreshErr);
                    console.log('Invalid refresh token2');
                    return res.status(404).send({ error: 'Invalid refresh token' });
                }
            } else {
                console.log(err);
                console.log('Invalid access token1');
                return res.status(404).send({ error: 'Invalid access token' });
            }
        }

    } else {
        console.log('No access token provided');
        return res.status(404).send({ error: 'No access token provided' });
    }
};
module.exports = { createEstimation, getEstimationsByUserId, getEstimationsById, updateEstimationById };