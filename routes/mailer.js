const express = require('express');
const router = express.Router();
const mailcontroller = require('../controllers/mailer');

router.post('/envoyeremail', mailcontroller.envoyerEmailAcceptation);

router.post('/confirmation', mailcontroller.confirmation);

module.exports = router;
