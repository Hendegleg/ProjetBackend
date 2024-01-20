const express = require('express');
const router = express.Router();
const userController = require('../controllers/utilisateur');
const eliminationController=require('../controllers/absenceElemination')
const Auth = require('../middlewares/auth');

router.get('/:id/profile', userController.getProfileAndStatusHistory);
router.get('/statistics', userController.generateStatistics);
router.get('/historiqueActiviteUser/:choristeId',Auth.authMiddleware,Auth.isAdminOrChoriste,userController.getChoristeActivityHistory);


module.exports = router;
//eliminationController.getChoristesNominés,eliminationController.getChoristesÉliminés,