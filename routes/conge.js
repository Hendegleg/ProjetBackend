const express = require('express');
const router = express.Router();
const Auth=require('../middlewares/auth')
const CongeController = require('../controllers/conge');

router.post('/declareLeave/:id', CongeController.declareLeave);
router.get('/getleave', CongeController.notifiercongechoriste)
router.post('/sendNotification', CongeController.sendNotification);
//tache35
router.get('/choristesanotifier',Auth.authMiddleware,Auth.isAdmin,CongeController.LeaveNotifications)
router.post('/modifyLeaveStatus', Auth.authMiddleware,Auth.isAdmin,CongeController.modifyLeaveStatus)

module.exports = router;
