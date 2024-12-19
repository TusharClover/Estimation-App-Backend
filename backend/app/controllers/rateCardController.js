const RateCard = require('../models/rateCard');
const jwt = require('jsonwebtoken');
// const logger = require('../logs/logger');

// Assume these environment variables are properly set
const secretKey = process.env.SECRET_KEY; // Access token secret key
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET; // Refresh token secret key

const getAllRateCard = async(req, res) => {
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

            const result = await RateCard.getAllRateCard(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                res.status(200).send({ message: 'RateCard fetch successfully!', result: result });
            } else {
                // logger.error('Failed to get Estimation');
                res.status(404).send({ error: 'Failed to get RateCard' });
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

                    const result = await RateCard.getAllRateCard(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'RateCard fetch successfully! with a new access token!',
                            result: result
                        });
                    } else {
                        // logger.error('No employees found');
                        return res.status(404).send({ error: 'No RateCard found' });
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

const getAllRateCardByEstId = async(req, res) => {
    const result = await RateCard.getAllRateCardByEstId(req.params);
    if (result) {
        // logger.info('Estimation fetch successfully!');
        res.status(200).send({ message: 'RateCard fetch successfully!', result: result });
    } else {
        // logger.error('Failed to get Estimation');
        res.status(404).send({ error: 'Failed to get RateCard' });
    }

};


module.exports = { getAllRateCard, getAllRateCardByEstId };