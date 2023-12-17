const express = require('express');
const router = express.Router();
const candidatController = require('../controllers/candidat');

// // Route pour obtenir tous les candidats
 router.get('/', candidatController.getAllCandidats);

// // Route pour obtenir un candidat par ID
 router.get('/:id', candidatController.getCandidatById);

// // Route pour mettre à jour un candidat par ID
 router.put('/:id', candidatController.updateCandidatById);

// // Route pour supprimer un candidat par ID
 router.delete('/:id', candidatController.deleteCandidatById);

// // Route pour ajouter un email candidat
router.post('/addEmailCandidat', candidatController.addEmailCandidat);


module.exports = router;
