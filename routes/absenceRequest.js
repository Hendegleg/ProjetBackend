const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
const  absenceElemination = require('../controllers/absenceElemination')
const auth = require('../middlewares/auth')
router.post('/createrequest/:id',auth.authMiddleware, auth.isChoriste, absenceController.informerAbsence);
router.get('/getabsence/:userId', absenceController.getAbsenceRequestsByUser);


router.post('/', absenceController.createAbsence);
router.get("/getparticipants/:repetitionId/:tessiture", absenceController.getChoristesByRepetitionAndPupitre);
router.get("/getparticipants/:concertId", absenceController.getChoristesByConcertAndPupitre);
//router.get("/getparticipants/:concertId", absenceController.getChoristesByConcertAndPupitre);


  



router.get('/getChoristedepasseseuil/:seuil',absenceElemination.getChoristedepasseseuil)
router.get('/gestionAbsencesExcessives/:seuil',absenceElemination.gestionAbsencesExcessives,absenceElemination.envoyermailnominé)

module.exports = router;