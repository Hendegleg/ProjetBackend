const express = require('express');
const router = express.Router();
const userController = require('../controllers/utilisateur');
const checkUserRole = require('../middlewares/checkUserRole');

router.get('/:id/profile', checkUserRole, userController.getProfileAndStatusHistory);

module.exports = router;