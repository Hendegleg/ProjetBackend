const express = require('express');
const router = express.Router()
const uploadFiles = require('../middlewares/uploadFiles');
const programController = require('../controllers/programme');

router.post('/', programController.addProgram);
router.post('/byfile', uploadFiles , programController.addProgramFromExcel);


module.exports = router;