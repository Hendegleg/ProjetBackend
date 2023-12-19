const express = require('express');
const router = express.Router();
const gerercontroller = require('../controllers/gerercandidat');

router.post('/acceptation', gerercontroller.envoyerEmailAcceptation);
router.post('/confirmation/:id', gerercontroller.confirmerEngagement);
router.post('/mailconfirmation/:id', gerercontroller.envoyerEmailConfirmation);
router.get('/liste', gerercontroller.getListeCandidats);
router.get('/confirmation-presence', gerercontroller.confirmerPresence);


module.exports = router;
