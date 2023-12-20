const express = require('express');
const router = express.Router();
const filtragecandidatController = require('../controllers/filtragecandidat');


// Route pour filtrer les condidat
router.get('/filter', filtragecandidatController.getCandidats); 


module.exports = router;