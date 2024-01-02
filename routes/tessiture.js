const express = require("express")
const router = express.Router()
const tessiturecontroller= require ("../controllers/tessiture")
const auth = require("../middlewares/auth")
router.put("/:id",auth.authMiddleware,auth.isAdmin ,tessiturecontroller.updateTessiture);
router.put ("/notif/:id",tessiturecontroller.NotifupdateTessiture)
module.exports = router