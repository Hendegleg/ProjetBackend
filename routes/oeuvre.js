const express = require('express');
const router = express.Router();
const oeuvreController = require('../controllers/oeuvre');

// Routes pour les œuvres
router.post('/', oeuvreController.createOeuvre);
router.get('/', oeuvreController.getAllOeuvres);
router.get('/:id', oeuvreController.getOeuvreById);
router.put('/:id', oeuvreController.updateOeuvre);
router.delete('/:id', oeuvreController.deleteOeuvre);

module.exports = router;
