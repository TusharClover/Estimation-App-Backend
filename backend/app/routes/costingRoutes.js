const express = require('express');
const { createCosting, getCostingById } = require("../controllers/costingController");

const router = express.Router();

router.post('/createCosting', createCosting);
router.get('/getCostingById/:id', getCostingById);

module.exports = router;