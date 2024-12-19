const express = require('express');
const { createProposedScheduleByEstnId, getProposedScheduleByEstnId, updateProposedScheduleByEstnId } = require("../controllers/proposedScheduleController");

const router = express.Router();

router.post('/createProposedScheduleByEstnId', createProposedScheduleByEstnId);
router.get('/getProposedScheduleByEstnId/:id', getProposedScheduleByEstnId);
router.put('/updateProposedScheduleByEstnId', updateProposedScheduleByEstnId);

module.exports = router;