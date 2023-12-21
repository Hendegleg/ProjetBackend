const express = require("express")
const router = express.Router()
const repetition= require ("../models/repetition")
const repetitioncontroller= require ("../controllers/repetition")
router.get("/", repetitioncontroller.fetchRepetitions);
router.post("/", repetitioncontroller.addRepetition);
router.get("/:id", repetitioncontroller.getRepetitionById);
router.put("/updaterepetition/:id", repetitioncontroller.updateRepetition);
router.delete("/deleterepetition/:id", repetitioncontroller.deleteRepetition);
router.post('/generatePupitreList', repetitioncontroller.generatePupitreList);
// router.get('/notifier', repetitioncontroller.envoyerNotificationChoristes);

module.exports = router