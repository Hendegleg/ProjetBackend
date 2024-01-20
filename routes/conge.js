const express = require('express');
const router = express.Router();
const Auth = require('../middlewares/auth');
const CongeController = require('../controllers/conge');
const auth = require("../middlewares/auth");

/**
 * @swagger
 * /conge/declareLeave:
 *   post:
 *     summary: Enregistrer une demande de congé
 *     tags: [Congés]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: "Date de début du congé (format : YYYY-MM-DD)"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: "Date de fin du congé (format : YYYY-MM-DD)"
 *             example:
 *               startDate: "2023-01-01"
 *               endDate: "2023-01-10"
 *     responses:
 *       '200':
 *         description: Demande de congé enregistrée avec succès
 *       '400':
 *         description: Requête incorrecte
 *       '404':
 *         description: Utilisateur non trouvé
 *       '500':
 *         description: Erreur interne du serveur
 */
router.post('/declareLeave', auth.authMiddleware, auth.isChoriste, CongeController.declareLeave);



router.get('/choristesanotifier', CongeController.LeaveNotifications);


router.post('/modifyLeaveStatus', CongeController.modifyLeaveStatus);

module.exports = router;
