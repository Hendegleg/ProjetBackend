const express = require('express');
const router = express.Router()
const uploadFile = require('../middlewares/uploadFiles');
const programController = require('../controllers/programme');

router.post('/', programController.addProgram);
router.post('/byfile', uploadFile , programController.addProgramFromExcel);


module.exports = router;