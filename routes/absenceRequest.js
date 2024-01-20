const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
const  absenceElemination = require('../controllers/absenceElemination')
const auth = require('../middlewares/auth')
/**
 * @swagger
 * /absence/createrequest:
 *   post:
 *     summary: Informer d'une absence à un événement (répétition ou concert)
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventType:
 *                 type: string
 *                 enum: [repetition, concert]
 *                 description: Type d'événement (répétition ou concert)
 *               eventDate:
 *                 type: string
 *                 format: date
 *              
 *               reason:
 *                 type: string
 *                 description: Raison de l'absence
 *             required:
 *               - eventType
 *               - eventDate
 *               - reason
 *     responses:
 *       '201':
 *         description: Demande d'absence créée avec succès
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Demande d'absence créée avec succès"
 *       '400':
 *         description: Requête incorrecte
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Les données requises sont manquantes dans le corps de la requête"
 *       '500':
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Erreur interne du serveur"
 */
router.post('/createrequest', auth.authMiddleware, auth.isChoriste, absenceController.informerAbsence);


/**
 * @swagger
 * /absence/getabsence/{userId}:
 *   get:
 *     summary: Récupérer les demandes d'absence pour un utilisateur spécifique
 *     tags: [Absence]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur pour lequel récupérer les demandes d'absence
 *     responses:
 *       '200':
 *         description: Succès de la récupération des demandes d'absence
 *       '404':
 *         description: Utilisateur non trouvé
 *       '500':
 *         description: Erreur interne du serveur
 */

router.get('/getabsence/:userId', absenceController.getAbsenceRequestsByUser);


router.post('/', absenceController.createAbsence);
router.get("/getparticipants/:repetitionId/:tessiture", absenceController.getChoristesByRepetitionAndPupitre);


router.get('/getChoristedepasseseuil/:seuil',absenceElemination.getChoristedepasseseuil)
router.get('/gestionAbsencesExcessives/:seuil',absenceElemination.gestionAbsencesExcessives,absenceElemination.envoyermailnominé)

module.exports = router;