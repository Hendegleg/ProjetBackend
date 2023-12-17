const express = require('express');
const router = express.Router()
const uploadFile = require('../middlewares/uploadFiles');
const addProgramFromExcel = require('../controllers/programme');

// Routes pour les œuvres
router.post('/byfile', uploadFile , addProgramFromExcel);

module.exports = router;