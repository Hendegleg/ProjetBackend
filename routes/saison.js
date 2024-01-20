
const express = require('express');
const router = express.Router();
const saisonController = require('../controllers/saison');

router.post('/', saisonController.createSaison);
router.get('/', saisonController.getAllSaisons);
router.get('/:id', saisonController.getSaisonById);
router.put('/:id', saisonController.updateSaison);
router.delete('/:id', saisonController.deleteSaison);

module.exports = router;
