const express = require('express');
const { login, getAll } = require("../controllers/userController");

const router = express.Router();

router.post('/login', login);
router.get('/getAll', getAll);

module.exports = router;