const express = require('express');
const { createCosting, getCostingById, insertEstimationStatus } = require("../controllers/costingController");

const router = express.Router();

router.post('/createCosting', createCosting);
router.get('/getCostingById/:id', getCostingById);
router.post('/insertEstimationStatus', insertEstimationStatus);

module.exports = router;