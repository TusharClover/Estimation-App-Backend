const express = require('express');
const { getAllProfiles } = require("../controllers/profilesController");

const router = express.Router();

router.get('/getAllProfiles', getAllProfiles);

module.exports = router;