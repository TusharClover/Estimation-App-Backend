const User = require('../models/user');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// Assume these environment variables are properly set
const secretKey = process.env.SECRET_KEY; // Access token secret key
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET; // Refresh token secret key

const accessTokenExpiry = '300s'; // Short expiration for access token
const refreshTokenExpiry = '9h'; // Longer expiration for refresh token

const generateTokens = (user) => {
    // Create access token
    const accessToken = jwt.sign({ user }, secretKey, { expiresIn: accessTokenExpiry });

    // Create refresh token
    const refreshToken = jwt.sign({ user }, refreshSecretKey, { expiresIn: refreshTokenExpiry });

    return { accessToken, refreshToken };
};

const login = async(req, res) => {
    try {
        const authenticatedUser = await User.login(req);
        console.log(authenticatedUser, "inside controller");

        if (authenticatedUser.user) {
            // console.log("do this");
            // Generate both access and refresh tokens
            const { accessToken, refreshToken } = generateTokens(authenticatedUser);

            // logger.info('User fetched successfully!');
            // Send both tokens in the response
            // console.log(res);
            res.status(200).send({
                message: 'User fetched successfully!',
                user: authenticatedUser.user,
                accessToken: accessToken,
                refreshToken: refreshToken
            });

        } else {
            // logger.error('Failed to get user');
            res.status(401).send({ error: 'Failed to get user' });
        }
    } catch (error) {
        // console.log(error);
        // logger.error(error);
        res.status(500).send({ error: error.message });
    }
};


const getAllReviewers = async(req, res) => {
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

            const result = await User.getAllReviewers(req.params);
            if (result) {
                // logger.info('Estimation fetch successfully!');
                return res.status(200).send({ message: 'Reviewers fetch successfully!', result: result, success: true });
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

                    const result = await User.getAllReviewers(req.params);

                    // console.log(result);

                    if (result) {
                        // logger.info('Employee fetch successfully! with a new access token!');
                        return res.status(200).send({
                            message: 'Reviewers fetch successfully! with a new access token!',
                            result: result,
                            success: true
                        });
                    } else {
                        // logger.error('No employees found');
                        return res.status(200).send({ error: 'Something went wrong, please check data properly', result: false, success: false });
                    }
                } catch (refreshErr) {
                    // logger.error('Invalid refresh token');
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


module.exports = { login, getAllReviewers };