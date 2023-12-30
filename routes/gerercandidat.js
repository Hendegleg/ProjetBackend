const express = require('express');
const router = express.Router();
const gerercontroller = require('../controllers/gerercandidat');
const Auth = require('../middlewares/auth')

router.post('/acceptation', Auth.authMiddleware , Auth.isAdminOrManager, gerercontroller.envoyerEmailAcceptation);
router.post('/mailconfirmation', Auth.authMiddleware , Auth.isAdminOrManager, gerercontroller.envoyerEmailConfirmation);
router.get('/liste', Auth.authMiddleware , Auth.isAdmin, Auth.isAdminOrManager, gerercontroller.getListeCandidats);
router.get('/confirmation-presence', Auth.authMiddleware , Auth.isAdminOrManager, gerercontroller.confirmerPresence);
router.get('/engagement', Auth.authMiddleware , Auth.isAdminOrManager, gerercontroller.confirmerEngagement);
router.get('/listeretenu', Auth.authMiddleware , Auth.isAdminOrManager, gerercontroller.getCandidatsRetenusParPupitre);
router.post('/besoin', Auth.authMiddleware , Auth.isAdminOrManager, gerercontroller.getListeCandidatsParPupitre);

module.exports = router;