const express = require('express');
const router = express.Router();
const absenceController = require('../controllers/absencerequest');
const  absenceElemination = require('../controllers/absenceElemination')
const auth = require('../middlewares/auth')
router.post('/createrequest/:id',auth.authMiddleware, auth.isChoriste, absenceController.informerAbsence);
router.get('/getabsence/:userId', absenceController.getAbsenceRequestsByUser);


router.post('/', absenceController.createAbsence);

/**
 * @swagger
 * components:
 *   schemas:
 *     Absence:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the absence
 *         choristeId:
 *           type: string
 *           description: The ID of the choriste associated with the absence
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the absence
 *         reason:
 *           type: string
 *           description: The reason for the absence
 *       example:
 *         _id: 12345
 *         choristeId: "67890"
 *         date: "2023-01-01"
 *         reason: "Sick"
 *     AbsenceResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Absence'
 *     AbsenceDetailsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             Participants_par_pupitre:
 *               type: object
 *               additionalProperties:
 *                 $ref: '#/components/schemas/Absence'
 *             Taux_absence_par_pupitre:
 *               type: object
 *               additionalProperties:
 *                 type: string
 *       example:
 *         message: "Success - List of choristes with their attendance details"
 *         data:
 *           Participants_par_pupitre:
 *             soprano:
 *               - _id: 12345
 *                 choristeId: "67890"
 *                 date: "2023-01-01"
 *                 reason: "Sick"
 *             alto:
 *               - _id: 67890
 *                 choristeId: "12345"
 *                 date: "2023-01-02"
 *                 reason: "Personal reasons"
 *           Taux_absence_par_pupitre:
 *             soprano: "25%"
 *             alto: "0%"
 *   responses:
 *     AbsenceResponse:
 *       200:
 *         $ref: '#/components/schemas/AbsenceResponse'
 *       500:
 *         description: Server error while fetching absences
 *     AbsenceDetailsResponse:
 *       200:
 *         $ref: '#/components/schemas/AbsenceDetailsResponse'
 *       500:
 *         description: Server error while fetching choristes' attendance details
 *   tags:
 *     - name: Absences
 *       description: API for managing choristes' absences
 */
/**
 * @swagger
 * /absence/getparticipants/{repetitionId}/{tessiture}:
 *   get:
 *     summary: Get absences by repetition and pupitre
 *     tags: [Absences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: repetitionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the repetition
 *       - in: path
 *         name: tessiture
 *         schema:
 *           type: string
 *         required: true
 *         description: The tessiture for which to retrieve absences
 *     responses:
 *       200:
 *         description: Success - List of choristes with their attendance details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tessiture:
 *                     type: string
 *                   Participants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         nom:
 *                           type: string
 *                         prenom:
 *                           type: string
 *                         email:
 *                           type: string
 *               example:
 *                 - tessiture: soprano
 *                   Participants:
 *                     - _id: 12345
 *                       nom: "Nom1"
 *                       prenom: "Prenom1"
 *                       email: "email1@example.com"
 *                 - tessiture: alto
 *                   Participants:
 *                     - _id: 67890
 *                       nom: "Nom2"
 *                       prenom: "Prenom2"
 *                       email: "email2@example.com"
 *       500:
 *         description: Server error while fetching choristes' attendance details
 */


router.get("/getparticipants/:repetitionId/:tessiture", auth.authMiddleware, auth.ischefpupitre, absenceController.getChoristesByRepetitionAndPupitre);

/**
 * @swagger
 * /absence/getparticipants/{concertId}:
 *   get:
 *     summary: Get choristes' attendance details by concert and pupitre
 *     tags: [Absences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: concertId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the concert
 *     responses:
 *       '200':
 *         description: Success - List of choristes with their attendance details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Participants_par_pupitre:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         nom:
 *                           type: string
 *                         prenom:
 *                           type: string
 *                         Nb_presence:
 *                           type: integer
 *                         Nb_absence:
 *                           type: integer
 *               Taux_absence_par_pupitre:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *               example:
 *                 Participants_par_pupitre:
 *                   soprano:
 *                     - id: "12345"
 *                       nom: "Nom"
 *                       prenom: "Prenom"
 *                       Nb_presence: 2
 *                       Nb_absence: 1
 *                   alto:
 *                     - id: "67890"
 *                       nom: "Nom2"
 *                       prenom: "Prenom2"
 *                       Nb_presence: 1
 *                       Nb_absence: 0
 *                 Taux_absence_par_pupitre:
 *                   soprano: "25%"
 *                   alto: "0%"
 *       '500':
 *         description: Server error while fetching choristes' attendance details
 */

router.get("/getparticipants/:concertId", auth.authMiddleware, auth.ischefpupitre, absenceController.getChoristesByConcertAndPupitre);



  

router.get('/getChoristedepasseseuil/:seuil',absenceElemination.getChoristedepasseseuil)
router.get('/gestionAbsencesExcessives/:seuil',absenceElemination.gestionAbsencesExcessives,absenceElemination.envoyermailnominé)

module.exports = router;