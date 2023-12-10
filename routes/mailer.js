const express = require('express');
const router = express.Router();
const mailcontroller = require('../controllers/mailer');

router.post('/acceptation', mailcontroller.envoyerEmailAcceptation);
router.post('/confirmation', mailcontroller.confirmerEngagement);

module.exports = router;
