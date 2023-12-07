const express = require('express');
const router = express.Router();
const mailerController = require('../controllers/mailer');

router.post('/envoyerEmailAcceptation/:id', mailerController.envoyerEmailAcceptation);

module.exports = router;
