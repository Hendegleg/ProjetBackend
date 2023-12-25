const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
router.post('/createrequest/:id', absenceController.informerAbsence);
router.get('/getabsence/:userId', absenceController.getAbsenceRequestsByUser);
module.exports = router;
