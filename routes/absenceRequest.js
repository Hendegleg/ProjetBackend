const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
const auth = require('../middlewares/auth')
const absenceElemination=require("../controllers/absenceElemination")



router.post('/createrequest/:id',auth.authMiddleware, auth.isChoriste, absenceController.informerAbsence);
router.get('/getabsence/:userId', absenceController.getAbsenceRequestsByUser);


router.post('/', absenceController.createAbsence);
router.get("/getparticipants/:repetitionId/:tessiture", absenceController.getChoristesByRepetitionAndPupitre);


router.get('/getChoristedepasseseuil/:seuil',absenceElemination.getChoristedepasseseuil)
router.get('/gestionAbsencesExcessives/:seuil',absenceElemination.gestionAbsencesExcessives,absenceElemination.envoyermailnominé)

router.get('/elimine',absenceElemination.getChoristesÉliminés);
router.get('/',absenceElemination.notifieradminChoristeseliminés)
router.get('/nomines',absenceElemination.getChoristesNominés)

module.exports = router;