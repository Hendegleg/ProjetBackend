const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');

router.post('/createrequest/:id', absenceController.informerAbsence);
router.get('/getabsence/:userId', absenceController.getAbsenceRequestsByUser);

router.post('/', absenceController.createAbsence);
router.get("/getparticipants/:repetitionId/:tessiture", absenceController.getChoristesByRepetitionAndPupitre);


module.exports = router;
