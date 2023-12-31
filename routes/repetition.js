const express = require("express")
const router = express.Router()
const repetitioncontroller= require ("../controllers/repetition")

router.get('/consulterEtatAbsencesRepetitions',  repetitioncontroller.consulterEtatAbsencesRepetitions);
router.get("/", repetitioncontroller.fetchRepetitions);
router.post("/", repetitioncontroller.addRepetition);
router.get("/:id", repetitioncontroller.getRepetitionById);
router.put("/updaterepetition/:id", repetitioncontroller.updateRepetition);
router.delete("/deleterepetition/:id", repetitioncontroller.deleteRepetition);
router.post('/generatePupitreList', repetitioncontroller.generatePupitreList);
router.post('/:id/ajouterPresenceManuelle', repetitioncontroller.ajouterPresenceManuelleRepetition);
router.post('/:id/confirmerpresence',  repetitioncontroller.confirmerpresenceRepetition);




module.exports = router