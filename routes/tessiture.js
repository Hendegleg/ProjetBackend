const express = require("express")
const router = express.Router()
const tessiturecontroller= require ("../controllers/tessiture")

router.put("/:id", tessiturecontroller.updateTessiture);

module.exports = router