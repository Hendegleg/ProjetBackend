const express = require('express');
const router = express.Router();
const userController = require('../controllers/utilisateur');
const statusHistoryController = require('../controllers/statusHistory');

const eliminationController=require('../controllers/absenceElemination')
const Auth = require('../middlewares/auth');




router.post('/ajouterStatus',Auth.authMiddleware,Auth.isAdminOrChoriste , statusHistoryController.addStatusChange);
router.get('/:id',Auth.authMiddleware,Auth.isAdmin , statusHistoryController.getStatusHistoryForUser);

router.get('/:id/profile',Auth.authMiddleware,Auth.isAdminOrChoriste ,userController.getProfile );


module.exports = router;
//eliminationController.getChoristesNominés,eliminationController.getChoristesÉliminés,