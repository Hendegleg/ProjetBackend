const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');
const EvenementAudition= require('../models/evenementaudition');

// Créer une nouvelle audition
router.post('/', auditionController.createAudition);

// Lire les informations d'une audition spécifique par son ID
router.get('/:id', auditionController.getAuditionById);

// Mettre à jour les détails d'une audition spécifique par son ID
router.patch('/:id', auditionController.updateAudition);

// Supprimer une audition spécifique par son ID
router.delete('/:id', auditionController.deleteAudition);

// Route pour générer le planning d'auditions
router.post('/generer-planning', auditionController.genererPlanification);


// Route pour cree les  auditions pour les candidats
router.post('/creeAuditionsCandidats', auditionController.createAuditionsForCandidats);

// Route to generate and send audition plans
//router.post('/generateAndSendAuditionPlan', auditionController.generateAndSendAuditionPlan);

router.post('/lancerEvenementAudition', auditionController.lancerEvenementAudition);

module.exports = router;
