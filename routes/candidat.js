const express = require('express');
const router = express.Router();
const candidatController = require('../controllers/candidat');

// Route pour créer un candidat
router.post('/', candidatController.createCandidat);

// Route pour obtenir tous les candidats
router.get('/', candidatController.getAllCandidats);

// Route pour obtenir un candidat par ID
router.get('/:id', candidatController.getCandidatById);

// Route pour mettre à jour un candidat par ID
router.put('/:id', candidatController.updateCandidatById);

// Route pour supprimer un candidat par ID
router.delete('/:id', candidatController.deleteCandidatById);

// Route pour envoyer le code de vérification par e-mail
router.post('/send-code', candidatController.sendCodeByEmail);

// Route pour filtrer les condidat
router.get('/filter', candidatController.getCandidats);


module.exports = router;