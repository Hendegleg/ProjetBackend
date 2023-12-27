const express = require('express');
const router = express.Router();

const absenceElemination =require('../controllers/absenceElemination')

router.post('/discipline',absenceElemination.eliminationDiscipline)
router.post('/absences_excessive',absenceElemination.eliminationExcessiveAbsences)

module.exports = router;