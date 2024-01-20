const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');
const EvenementAudition= require('../models/evenementaudition');
const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Auditions
 *   description: API operations related to auditions
 */

/**
 * @swagger
 * /auditions:
 *   post:
 *     summary: Create a new audition
 *     tags: [Auditions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 *     responses:
 *       201:
 *         description: Audition created successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auditions:
 *   get:
 *     summary: Get all auditions
 *     tags: [Auditions]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               audition:
 *                 _id: 1234567890
 *                 date_audition: "2022-01-30"
 *                 heure_debut: "12:00 PM"
 *                 heure_fin: "02:00 PM"
 *                 evenementAudition: "event123"
 *                 candidat: "candidate123"
 *                 extraitChante: "Sample song excerpt"
 *                 tessiture: "Soprano"
 *                 evaluation: "A"
 *                 decisioneventuelle: "retenu"
 *                 remarque: "Additional remarks"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auditions/{id}:
 *   get:
 *     summary: Get a specific audition by ID
 *     tags: [Auditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audition ID
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
  *               audition:
 *                 _id: 1234567890
 *                 date_audition: "2022-01-30"
 *                 heure_debut: "12:00 PM"
 *                 heure_fin: "02:00 PM"
 *                 evenementAudition: "event123"
 *                 candidat: "candidate123"
 *                 extraitChante: "Sample song excerpt"
 *                 tessiture: "Soprano"
 *                 evaluation: "A"
 *                 decisioneventuelle: "retenu"
 *                 remarque: "Additional remarks"
 *       404:
 *         description: Audition not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auditions/{id}:
 *   patch:
 *     summary: Update a specific audition by ID
 *     tags: [Auditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audition ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 *     responses:
 *       200:
 *         description: Audition updated successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       404:
 *         description: Audition not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auditions/{id}:
 *   delete:
 *     summary: Delete a specific audition by ID
 *     tags: [Auditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Audition ID
 *     responses:
 *       200:
 *         description: Audition deleted successfully
 *       404:
 *         description: Audition not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Audition:
 *       type: object
 *       properties:
 *         date_audition:
 *           type: string
 *           format: date
 *         heure_debut:
 *           type: string
 *           format: time
 *         heure_fin:
 *           type: string
 *           format: time
 *         evenementAudition:
 *           type: string
 *           description: ID of the related event
 *         candidat:
 *           type: string
 *           description: ID of the related candidate
 *         extraitChante:
 *           type: string
 *           description: Extract of the song sung during the audition
 *         tessiture:
 *           type: string
 *           enum: [Soprano, Alto, Ténor, Basse, Autre]
 *         evaluation:
 *           type: string
 *           enum: [A, B, C]
 *         decisioneventuelle:
 *           type: string
 *           enum: [retenu, en attente, refuse]
 *         remarque:
 *           type: string
 *           description: Additional remarks about the audition
 *       required:
 *         - extraitChante
 *         - tessiture
 *         - evaluation
 *         - decisioneventuelle
 *         - remarque
 */


router.post('/', auditionController.createAudition);
router.get('/', auditionController.getAudition);
router.get('/:id', auditionController.getAuditionById);

router.patch('/:id', auditionController.updateAudition);
router.delete('/:id', auditionController.deleteAudition);
router.post('/lancerEvenementAudition', auditionController.lancerEvenementAudition);



router.post('/generer-planning', auth.authMiddleware, auth.isAdmin, auditionController.genererPlanification);
/**
 * @swagger
 * /auditions/generer-planning:
 *   post:
 *     summary: Generate audition schedule
 *     tags: [Auditions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tessiture:
 *                 type: string
 *                 description: The tessiture field for the audition
 *               extraitChante:
 *                 type: string
 *                 description: The extraitChante field for the audition
 *             required:
 *               - tessiture
 *               - extraitChante
 *               
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Schedule generated successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */


router.post('/genererplanabsence', auth.authMiddleware, auth.isAdmin, auditionController.genererPlanificationabsence);
/**
 * @swagger
 * /auditions/genererplanabsence:
 *   post:
 *     summary: Generate absence schedule for auditions
 *     tags: [Auditions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Define your request body properties here
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Absence schedule generated successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */



module.exports = router;
