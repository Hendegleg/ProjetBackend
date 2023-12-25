const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
const absenceElemination=require('../controllers/absenceElemination')


router.post('/createrequest', absenceController.createAbsenceRequest);
router.get('/getabsence/:id', absenceController.getAbsenceRequestsByUser);


router.get('/nomines',absenceElemination.getChoristesNominés)
router.get('/elimine',absenceElemination.getChoristesÉliminés)
router.get('/getChoristedepasseseuil/:seuil',absenceElemination.getChoristedepasseseuil)

module.exports = router;