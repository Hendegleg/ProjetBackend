const express = require('express');
const router = express.Router();
const Auth=require('../middlewares/auth')
const CongeController = require('../controllers/conge');
const auth = require("../middlewares/auth")
router.post('/declareLeave/:id',auth.isChoriste, CongeController.declareLeave);
router.get('/getleave', CongeController.notifiercongechoriste)
/*router.post('/sendNotification', CongeController.sendNotification);*/
//tache35


router.get('/choristesanotifier',Auth.authMiddleware,Auth.isAdmin,CongeController.LeaveNotifications)


/**
 * @swagger
 * /modifyLeaveStatus:
 *   post:
 *     summary: Modify leave status for a chorister
 *     tags:
 *       - Leave
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the chorister
 *                 example: "123"
 *               approved:
 *                 type: boolean
 *                 description: Whether the leave request is approved
 *                 example: true
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Statut de congé modifié avec succès.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: Utilisateur non trouvé
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post('/modifyLeaveStatus', Auth.authMiddleware,Auth.isAdmin,CongeController.modifyLeaveStatus)

module.exports = router;
