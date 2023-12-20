const express = require('express');
const router = express.Router();
const candidatController = require('../controllers/candidat');

//getAll
 router.get('/', candidatController.getAllCandidats);
//create without verif
 router.post('/', candidatController.create);


// get By Id
 router.get('/:id', candidatController.getCandidatById);

// Update
 router.put('/:id', candidatController.updateCandidatById);

// delete
 router.delete('/:id', candidatController.deleteCandidatById);

// create with verif
router.get("/:id/verify/:token/", candidatController.verifyEmailToken);
router.post('/addEmailCandidat', candidatController.addEmailCandidat);
router.post("/:id",candidatController.createCandidat)


module.exports = router;
