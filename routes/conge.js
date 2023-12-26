const express = require('express');
const router = express.Router();
const CongeController = require('../controllers/conge');
const Auth=require('../middlewares/auth')
 

router.post('/declareLeave', CongeController.declareLeave);
router.post('/sendNotification', CongeController.sendNotification);
//tache35
router.get('/choristesanotifier',CongeController.LeaveNotifications)
router.post('/modifyLeaveStatus', CongeController.modifyLeaveStatus)

module.exports = router;
