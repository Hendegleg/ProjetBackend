const express = require('express');
const router = express.Router();
const userController = require('../controllers/utilisateur');
const eliminationController=require('../controllers/absenceElemination')
const Auth = require('../middlewares/auth');

router.get('/:id/profile', Auth.authMiddleware ,Auth.isAdmin,Auth.isChoriste, userController.getProfileAndStatusHistory);
module.exports = router;
//eliminationController.getChoristesNominés,eliminationController.getChoristesÉliminés,