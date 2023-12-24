const express = require('express');
const router = express.Router();
const CongeController = require('../controllers/conge');
router.post('/declareLeave/:id', CongeController.declareLeave);
router.post('/sendNotification', CongeController.sendNotification);

module.exports = router;
