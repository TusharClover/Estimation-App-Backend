const express = require('express');
const { createDevEfforts, getDevEffortsById, deleteDevEffortById, updateDevEffortById, getTotalCountOfDevEffortsByEstId } = require("../controllers/devEffortsController");

const router = express.Router();

router.post('/createDevEfforts', createDevEfforts);
router.get('/getDevEffortsById/:id', getDevEffortsById);
router.delete('/deleteDevEffortById/:id', deleteDevEffortById);
router.put('/updateDevEffortById', updateDevEffortById);
router.get('/getTotalCountOfDevEffortsByEstId/:estimation_id', getTotalCountOfDevEffortsByEstId);


module.exports = router;