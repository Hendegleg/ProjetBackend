const express = require("express")
const router = express.Router()
const repetitioncontroller= require ("../controllers/repetition")
const auth = require("../middlewares/auth")

router.get("/",auth.authMiddleware,auth.isAdmin,repetitioncontroller.fetchRepetitions);
router.post("/",auth.authMiddleware,auth.isAdmin, repetitioncontroller.addRepetition);
router.post("/add",auth.authMiddleware,auth.isAdmin, repetitioncontroller.addRepetitionn);
router.get("/:id",auth.authMiddleware,auth.isAdmin, repetitioncontroller.getRepetitionById);
router.put("/updaterepetition/:id" ,auth.authMiddleware,auth.isAdmin, repetitioncontroller.updateRepetition);
router.delete("/deleterepetition/:id",auth.authMiddleware,auth.isAdmin, repetitioncontroller.deleteRepetition);
router.post('/generatePupitreList',auth.authMiddleware,auth.isAdmin, repetitioncontroller.generatePupitreList);

router.get('/consulterEtatAbsencesRepetitions',  repetitioncontroller.consulterEtatAbsencesRepetitions);
router.post('/:id/ajouterPresenceManuelle', repetitioncontroller.ajouterPresenceManuelleRepetition);
router.post('/:id/confirmerpresence',  repetitioncontroller.confirmerpresenceRepetition);




module.exports = router