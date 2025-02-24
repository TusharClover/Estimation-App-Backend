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
            const result = await Estimations.createEstimation(req.body);
            if (result) {
                return res.status(200).send({ message: 'Estimations created successfully!', result: result.insertId, success: true });
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

                    const result = await Estimations.createEstimation(req.body);
                    if (result) {
                        return res.status(200).send({ message: 'Estimations created successfully!', result: result.insertId ? true : false, success: true });
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
            return res.status(404).send({ error: 'Please check access token' });
        }
        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                console.log('User not authorized');
                return res.status(404).send({ error: 'User is not authenticated' });
            }

            const result = await Estimations.getEstimationsByUserId(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'Estimation fetch successfully!', result: result, success: true });
            } else {
                // logger.error('Failed to get Estimation');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
            }
        } catch (err) {
            console.log('inside catch', err);
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    console.log('No refresh token provided');
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

                    const result = await Estimations.getEstimationsByUserId(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'Estimation fetch successfully! with a new access token!',
                            result: result,
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
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }

    } else {
        return res.status(404).send({ error: 'Headers not added properly' });
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

            const result = await Estimations.getEstimationsById(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'Estimation fetch successfully!', result: result[0], success: true });
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

                    const result = await Estimation.getEstimationsById(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'Estimation fetch successfully! with a new access token!',
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
            return res.status(404).send({ error: 'Please check access token' });
        }


        try {
            // Verify access token
            const authData = jwt.verify(accessToken, secretKey);

            // Check if the user is valid
            if (!authData.user) {
                console.log('User not authorized');
                return res.status(404).send({ error: 'User is not authenticated' });
            }
            // If verification succeeds, proceed to get employees
            const result = await Estimations.updateEstimationById(req);
            console.log(result, "Result");
            if (result) {
                // logger.info('Employee fetch successfully!');
                res.status(200).send({ message: 'Estimations fetch successfully!', result: result[0], success: true });
            } else {
                // logger.error('Failed to create employee');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
            }
        } catch (err) {
            console.log(err.name, "Error Name");
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    console.log('No refresh token provided');
                    return res.status(404).send({ error: 'Please check refresh token' });
                }

                try { // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        // logger.error('User not authorized');
                        return res.status(404).send({ error: 'User is not authenticated' });
                    }
                    const result = await Estimations.updateEstimationById(req);
                    console.log(result, "error");
                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({ message: 'Estimations fetch successfully! with a new access token!', result: result[0], success: true });
                    } else {
                        // logger.error('No employees found');
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


const getEstimationByUserId = async(req, res) => {
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

            const result = await Estimations.getEstimationByUserId(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'Estimation fetch successfully!', result: result[0], success: true });
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

                    const result = await Estimation.getEstimationByUserId(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'Estimation fetch successfully! with a new access token!',
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


const deleteEstimationById = async(req, res) => {
    console.log("Delete Estimation");
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

            const result = await Estimations.deleteEstimationById(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'Estimation deleted successfully!', result: result[0], success: true });
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

                    const result = await Estimation.deleteEstimationById(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'Estimation deleted successfully! with a new access token!',
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

module.exports = { createEstimation, getEstimationsByUserId, getEstimationsById, updateEstimationById, getEstimationByUserId, deleteEstimationById };