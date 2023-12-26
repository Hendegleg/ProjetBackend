const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
const auth = require('../middlewares/auth')
router.post('/createrequest/:id',auth.authMiddleware, auth.isChoriste, absenceController.informerAbsence);
router.get('/getabsence/:userId', absenceController.getAbsenceRequestsByUser);
module.exports = router;
