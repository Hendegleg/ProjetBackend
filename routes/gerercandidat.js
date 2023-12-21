const express = require('express');
const router = express.Router();
const gerercontroller = require('../controllers/gerercandidat');

router.post('/acceptation', gerercontroller.envoyerEmailAcceptation);
router.post('/mailconfirmation/:id', gerercontroller.envoyerEmailConfirmation);
router.get('/liste', gerercontroller.getListeCandidats);
router.get('/confirmation-presence', gerercontroller.confirmerPresence);
router.get('/engagement', gerercontroller.confirmerEngagement);
router.get('/listeretenu', gerercontroller.getCandidatsRetenusParPupitre);
router.post('/besoin', gerercontroller.getListeCandidatsParPupitre);



module.exports = router;