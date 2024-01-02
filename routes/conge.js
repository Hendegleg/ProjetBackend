const express = require('express');
const router = express.Router();
const Auth=require('../middlewares/auth')
const CongeController = require('../controllers/conge');
const auth = require("../middlewares/auth")
router.post('/declareLeave/:id',auth.isChoriste, CongeController.declareLeave);
router.get('/getleave', CongeController.notifiercongechoriste)
/*router.post('/sendNotification', CongeController.sendNotification);*/
//tache35
router.get('/choristesanotifier',CongeController.LeaveNotifications)
router.post('/modifyLeaveStatus', CongeController.modifyLeaveStatus)
router.post('/notifmodifyLeaveStatus', CongeController.notifmodifyLeaveStatus)
module.exports = router;
