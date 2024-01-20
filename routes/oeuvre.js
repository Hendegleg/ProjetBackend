const express = require('express');
const router = express.Router();
const oeuvreController = require('../controllers/oeuvre');

router.get('/statistics', oeuvreController.OeuvreStatistics)
router.post('/', oeuvreController.createOeuvre);
router.get('/', oeuvreController.getAllOeuvres);
router.get('/:id', oeuvreController.getOeuvreById);
router.put('/:id', oeuvreController.updateOeuvre);
router.delete('/:id', oeuvreController.deleteOeuvre);


module.exports = router;
