const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
const auth = require('../middlewares/auth')
const absenceElemination=require("../controllers/absenceElemination")




router.post('/createrequest/:id',auth.authMiddleware, auth.isChoriste, absenceController.informerAbsence);
router.get('/getabsence/:id',auth.authMiddleware,auth.isAdmin, absenceController.getAbsenceRequestsByUser);


router.post('/', absenceController.createAbsence);
router.get("/getparticipants/:repetitionId/:tessiture", absenceController.getChoristesByRepetitionAndPupitre);

/**
 * @swagger
 * /absence/getChoristedepasseseuil/{seuil}:
 *   get:
 *     summary: Get choristes depasse seuil
 *     parameters:
 *       - in: path
 *         name: seuil
 *         required: true
 *         description: The threshold value.
 *         schema:
 *           type: integer
 *     tags:
 *       - Choristes
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/getChoristedepasseseuil/:seuil',auth.authMiddleware,auth.isAdmin, absenceElemination.getChoristedepasseseuil)
router.get('/gestionAbsencesExcessives/:seuil',auth.authMiddleware,auth.isAdmin, absenceElemination.gestionAbsencesExcessives,absenceElemination.envoyermailnominé)
/**
 * @swagger
 * /absence/elimine:
 *   get:
 *     summary: Get eliminated choristes
 *     tags:
 *       - Elimination
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - Invalid token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get('/elimine',auth.authMiddleware,auth.isAdmin, absenceElemination.getChoristesÉliminés);
/**
 * @swagger
 * /absence/:
 *   get:
 *     summary: Notify admin about eliminated choristes
 *     tags:
 *       - Elimination
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - Invalid token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get('/',auth.authMiddleware,auth.isAdmin, absenceElemination.notifieradminChoristeseliminés)
/**
 * @swagger
 * /absence/nomines:
 *   get:
 *     summary: Get nominated choristes
 *     tags:
 *       - Elimination
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - Invalid token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.get('/nomines',auth.authMiddleware,auth.isAdmin, absenceElemination.getChoristesNominés)

module.exports = router;