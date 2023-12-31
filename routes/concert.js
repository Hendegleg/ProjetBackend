const express = require('express');
const router = express.Router();
const concertController = require('../controllers/concert');
const uploadFile = require('../middlewares/uploadFiles');

// Routes pour gérer les concerts
router.post('/', concertController.createConcert); 
router.get('/', concertController.getAllConcerts); 
router.put('/:id', concertController.updateConcert); 
router.delete('/:id', concertController.deleteConcert); 
router.post('/:id/confirmerpresence', concertController.confirmerpresenceConcert);


module.exports = router;