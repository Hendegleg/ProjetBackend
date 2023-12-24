const express = require('express');
const router = express.Router();
const userController = require('../controllers/utilisateur');
const Auth = require('../middlewares/auth');

router.get('/:id/profile',userController.getProfileAndStatusHistory);

module.exports = router;