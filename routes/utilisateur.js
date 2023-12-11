const express = require('express');
const router = express.Router();
const userController = require('../controllers/utilisateur');
const checkUserRole = require('../middleware/checkUserRole');

// Route pour consulter le profil et l'historique du statut d'un utilisateur
router.get('/users/:id/profile', checkUserRole, userController.getProfileAndStatusHistory);

module.exports = router;