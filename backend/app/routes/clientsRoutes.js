const express = require('express');
const { getAllClients } = require("../controllers/clientsController");

const router = express.Router();

router.get('/getAllClients', getAllClients);

module.exports = router;