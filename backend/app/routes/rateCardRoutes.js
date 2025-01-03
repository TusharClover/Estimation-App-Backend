const express = require('express');
const { getAllRateCard, getAllRateCardByEstId, getCostingBasedOnRateCardByEstId } = require("../controllers/rateCardController");

const router = express.Router();

router.get('/getAllRateCard', getAllRateCard);
router.get('/getAllRateCardByEstId/:estimation_id', getAllRateCardByEstId);
router.get('/getCostingBasedOnRateCardByEstId/:estimation_id', getCostingBasedOnRateCardByEstId);


module.exports = router;