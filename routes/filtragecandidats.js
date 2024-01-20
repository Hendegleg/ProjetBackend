const express = require('express');
const router = express.Router();
const filtragecandidatController = require('../controllers/filtragecandidat');
const Auth = require("../middlewares/auth")


/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Operations related to candidates
 * 
 * /filter:
 *   get:
 *     summary: Get candidates based on filtering criteria
 *     description: Returns a list of candidates based on specified filters.
 *     tags:
 *       - Candidates
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/filter',Auth.authMiddleware,Auth.isAdmin,filtragecandidatController.getCandidats); 


module.exports = router;