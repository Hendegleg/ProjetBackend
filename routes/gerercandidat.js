const express = require('express');
const router = express.Router();
const mailcontroller = require('../controllers/gerercandidat');

router.post('/acceptation', mailcontroller.envoyerEmailAcceptation);
router.post('/confirmation', mailcontroller.confirmerEngagement);
router.post('/mailconfirmation', mailcontroller.envoyerEmailConfirmation);
router.get('/liste', mailcontroller.getListeCandidats);


module.exports = router;
