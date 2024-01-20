const express = require('express');
const router = express.Router();
const concertController = require('../controllers/concert');


  
 
// Routes pour gérer les concerts
router.post('/', concertController.createConcert);
router.get('/', concertController.getAllConcerts); 
router.put('/:id', concertController.updateConcert); 
router.delete('/:id', concertController.deleteConcert); 
router.post('/:id/confirmerpresence', concertController.confirmerpresenceConcert);

router.get('/:id/confirmedChoristes', concertController.getConfirmedChoristesForConcert);
router.post('/:id/ajouterpresence', concertController.ajouterPresenceManuelle);
router.post('/:id/indiquerconfirmation', concertController.indiquerpresenceConcert);
router.get('/concerts/statistics', concertController.getConcertStatistics);

module.exports = router;