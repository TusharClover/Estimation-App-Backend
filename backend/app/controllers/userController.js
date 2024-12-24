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

        if (authenticatedUser) {
            // Generate both access and refresh tokens
            const { accessToken, refreshToken } = generateTokens(authenticatedUser);

            // logger.info('User fetched successfully!');
            // Send both tokens in the response
            // console.log(res);
            res.status(200).send({
                message: 'User fetched successfully!',
                userId: authenticatedUser.user_id,
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

const getAll = async(req, res) => {
    console.log(req, res);
};

module.exports = { login, getAll };