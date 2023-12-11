const express = require('express');
const router = express.Router();
const concertController = require('../controllers/concertController');

// Routes pour gérer les concerts
router.post('/concerts', concertController.createConcert); 
router.get('/concerts', concertController.getAllConcerts); 
router.put('/concerts/:id', concertController.updateConcert); 
router.delete('/concerts/:id', concertController.deleteConcert); 


// Route pour importer des concerts depuis un fichier Excel
router.post('/import-concerts', concertController.importerConcertsDepuisExcel);

module.exports = router;