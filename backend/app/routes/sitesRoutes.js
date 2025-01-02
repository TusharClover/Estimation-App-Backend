const express = require('express');
const { getAllSites } = require("../controllers/sitesController");

const router = express.Router();

router.get('/getAllSites', getAllSites);

module.exports = router;