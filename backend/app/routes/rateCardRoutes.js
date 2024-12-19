const express = require('express');
const { getAllRateCard, getAllRateCardByEstId } = require("../controllers/rateCardController");

const router = express.Router();

router.get('/getAllRateCard', getAllRateCard);
router.get('/getAllRateCardByEstId/:estimation_id', getAllRateCardByEstId);

module.exports = router;