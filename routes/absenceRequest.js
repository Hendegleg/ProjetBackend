const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
const absenceElemination=require('../controllers/absenceElemination')



router.post('/createrequest', absenceController.createAbsenceRequest);
router.get('/getabsence/:id', absenceController.getAbsenceRequestsByUser);

router.post('/', absenceController.createAbsence);
router.get("/getparticipants/:repetitionId/:tessiture", absenceController.getChoristesByRepetitionAndPupitre);


router.get('/getChoristedepasseseuil/:seuil',absenceElemination.getChoristedepasseseuil)
router.get('/gestionAbsencesExcessives/:seuil',absenceElemination.gestionAbsencesExcessives,absenceElemination.envoyermailnominé)


module.exports = router;