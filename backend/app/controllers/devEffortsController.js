const DevEfforts = require('../models/devEfforts');
const jwt = require('jsonwebtoken');
// const logger = require('../logs/logger');

// Assume these environment variables are properly set
const secretKey = process.env.SECRET_KEY; // Access token secret key
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET; // Refresh token secret key

const createDevEfforts = async(req, res) => {
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
            const result = await DevEfforts.createDevEfforts(req.body);
            if (result) {
                // logger.info('Estimations created successfully!');
                res.status(200).send({ message: 'Dev Efforts created successfully!', result: result[0], success: true });
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
                    const result = await DevEfforts.createDevEfforts(req.body);
                    if (result) {
                        // logger.info('Estimations created successfully! with a new access token!');
                        return res.status(200).send({ message: 'Dev Efforts created successfully! with a new access token!', result: result[0], success: true });
                    } else {
                        // logger.error('No Estimations found');
                        return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                    }
                } catch (refreshErr) {
                    console.log(refreshErr, "resfresh Error");
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

const getDevEffortsById = async(req, res) => {
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

            const result = await DevEfforts.getDevEffortsById(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'DevEfforts fetch successfully!', result: result, success: true });
            } else {
                // logger.error('Failed to get Estimation');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
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

                    const result = await DevEfforts.getDevEffortsById(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'DevEfforts fetch successfully! with a new access token!',
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
                // logger.error('Invalid access token');
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }

    } else {
        // logger.error('No access token provided');
        return res.status(404).send({ error: 'Headers not added properly' });
    }
};

const deleteDevEffortById = async(req, res) => {
    const header = req.headers['authorization'];

    if (header) {

        const headersArr = header.split(',');

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
            const result = await DevEfforts.deleteDevEffortById(req.params);
            if (result) {
                console.log('DevEfforts delete successfully!');
                res.status(200).send({ message: 'DevEfforts delete successfully!', result: result[0], success: true });
            } else {
                console.log('Failed to delete DevEfforts');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
            }
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) {
                    console.log('No refresh token provided');
                    return res.status(404).send({ error: 'No refresh token provided' });
                }

                try { // Verify the refresh token
                    const authData = jwt.verify(refreshToken, refreshSecretKey);

                    // Check if the user is valid
                    if (!authData.user) {
                        console.log('User not authorized');
                        return res.status(404).send({ error: 'User not authorized' });
                    }
                    const result = await DevEfforts.deleteDevEffortById(req.params);
                    if (result) {
                        console.log('DevEfforts delete successfully! with a new access token!');
                        return res.status(200).send({ message: 'DevEfforts delete successfully! with a new access token!', result: result[0], success: true });
                    } else {
                        console.log('No DevEfforts found');
                        return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                    }
                } catch (refreshErr) {
                    console.log(refreshErr, "resfresh Error");
                    return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                }
            } else {
                // console.log(err);
                console.log('Invalid access token');
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }


    } else {
        console.log('No access token provided');
        return res.status(404).send({ error: 'Headers not added properly' });
    }
};

const updateDevEffortById = async(req, res) => {

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
            const result = await DevEfforts.updateDevEffortById(req);
            console.log(result, "Result");
            if (result) {
                // logger.info('Employee fetch successfully!');
                res.status(200).send({ message: 'DevEfforts fetch successfully!', result: result[0], success: true });
            } else {
                // logger.error('Failed to create employee');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
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
                    const result = await DevEfforts.updateDevEffortById(req);
                    console.log(result, "error");
                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({ message: 'DevEfforts fetch successfully! with a new access token!', result: result[0], success: true });
                    } else {
                        // logger.error('No employees found');
                        return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                    }
                } catch (refreshErr) {
                    console.log(refreshErr, "resfresh Error");
                    return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                }
            } else {
                console.log(err);
                console.log('Invalid access token1');
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }

    } else {
        console.log('No access token provided');
        return res.status(404).send({ error: 'Headers not added properly' });
    }
};

const getTotalCountOfDevEffortsByEstId = async(req, res) => {
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

            const result = await DevEfforts.getTotalCountOfDevEffortsByEstId(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'DevEfforts fetch successfully!', result: result, success: true });
            } else {
                // logger.error('Failed to get Estimation');
                return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
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

                    const result = await DevEfforts.getTotalCountOfDevEffortsByEstId(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'DevEfforts fetch successfully! with a new access token!',
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
                // logger.error('Invalid access token');
                return res.status(404).send({ error: 'Please check token, token got expired' });
            }
        }

    } else {
        // logger.error('No access token provided');
        return res.status(404).send({ error: 'Headers not added properly' });
    }
};


module.exports = { createDevEfforts, getDevEffortsById, deleteDevEffortById, updateDevEffortById, getTotalCountOfDevEffortsByEstId };