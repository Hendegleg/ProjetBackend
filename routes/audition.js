const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');


// Créer une nouvelle audition
router.post('/', auditionController.createAudition);

// Lire les informations d'une audition spécifique par son ID
router.get('/:id', auditionController.getAuditionById);

// Mettre à jour les détails d'une audition spécifique par son ID
router.patch('/:id', auditionController.updateAudition);

// Supprimer une audition spécifique par son ID
router.delete('/:id', auditionController.deleteAudition);
// Route pour générer le planning d'auditions
router.post('/generer-planning', auditionController.genererPlanning);

module.exports = router;