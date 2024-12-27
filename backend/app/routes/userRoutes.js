const express = require('express');
const { login, getAllReviewers } = require("../controllers/userController");

const router = express.Router();

router.post('/login', login);
router.get('/getAllReviewers', getAllReviewers);

module.exports = router;