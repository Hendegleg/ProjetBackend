const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');

router.post('/createrequest', absenceController.createAbsenceRequest);
router.post('/getabsence', absenceController.getAbsenceRequestsByUser);

router.post('/', absenceController.createAbsence);
router.get("/getparticipants/:repetitionId/:tessiture", absenceController.getChoristesByRepetitionAndPupitre);



module.exports = router;
