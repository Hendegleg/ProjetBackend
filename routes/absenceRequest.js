const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
router.post('/createrequest', absenceController.createAbsenceRequest);
router.post('/getabsence', absenceController.getAbsenceRequestsByUser);

module.exports = router;
