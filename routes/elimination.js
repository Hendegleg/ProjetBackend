const express = require('express');
const router = express.Router();
const auth=require('../middlewares/auth')

const absenceElemination =require('../controllers/absenceElemination')

router.post('/discipline',auth.isAdmin,absenceElemination.eliminationDiscipline)
router.post('/absences_excessive',auth.isAdmin,absenceElemination.eliminationExcessiveAbsences)



module.exports = router;