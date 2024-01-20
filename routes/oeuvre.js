const express = require('express');
const router = express.Router();
const oeuvreController = require('../controllers/oeuvre');
const auth = require('../middlewares/auth');

router.get('/statistics',auth.authMiddleware,auth.isAdmin , oeuvreController.OeuvreStatistics);
/**
 * @swagger
 * components:
 *   schemas:
 *     Oeuvre:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the oeuvre
 *         title:
 *           type: string
 *           description: The oeuvre title
 *         artist:
 *           type: string
 *           description: The artist of the oeuvre
 *       example:
 *         _id: 12345
 *         title: La boheme
 *         artist: Charles Aznavour
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewOeuvre:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *       properties:
 *         title:
 *           type: string
 *           description: The oeuvre title
 *         artist:
 *           type: string
 *           description: The artist of the oeuvre
 *       example:
 *         title: La boheme
 *         artist: Charles Aznavour
 */

/**
 * @swagger
 * components:
 *   responses:
 *     StandardResponse:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Oeuvre'
 *       404:
 *         description: Oeuvre not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * tags:
 *   name: Oeuvres
 *   description: API de gestion des oeuvres d'art
 */

/**
 * @swagger
 * /oeuvres:
 *   get:
 *     summary: List all oeuvres
 *     tags: [Oeuvres]
 *     security: []
 *     responses:
 *       $ref: '#/components/responses/StandardResponse'
 */
router.get('/', auth.authMiddleware, auth.isAdmin, oeuvreController.getAllOeuvres);

/**
 * @swagger
 * /oeuvres:
 *   post:
 *     summary: Create a new oeuvre
 *     tags: [Oeuvres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewOeuvre'
 *     responses:
 *       $ref: '#/components/responses/StandardResponse'
 */
router.post('/', auth.authMiddleware, auth.isAdmin, oeuvreController.createOeuvre);

/**
 * @swagger
 * /oeuvres/{id}:
 *   get:
 *     summary: Get an oeuvre by ID
 *     tags: [Oeuvres]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the oeuvre
 *     responses:
 *       $ref: '#/components/responses/StandardResponse'
 */
router.get('/:id', auth.authMiddleware, auth.isAdmin, oeuvreController.getOeuvreById);

/**
 * @swagger
 * /oeuvres/{id}:
 *   put:
 *     summary: Update an oeuvre by ID
 *     tags: [Oeuvres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the oeuvre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewOeuvre'
 *     responses:
 *       $ref: '#/components/responses/StandardResponse'
 */
router.put('/:id', auth.authMiddleware, auth.isAdmin, oeuvreController.updateOeuvre);

/**
 * @swagger
 * /oeuvres/{id}:
 *   delete:
 *     summary: Delete an oeuvre by ID
 *     tags: [Oeuvres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the oeuvre
 *     responses:
 *       $ref: '#/components/responses/StandardResponse'
 */
router.delete('/:id', auth.authMiddleware, auth.isAdmin, oeuvreController.deleteOeuvre);
/**
 * @swagger
 * /oeuvres/statistics:
 *   get:
 *     summary: Get statistics for oeuvres
 *     tags: [Oeuvres]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statistics:
 *                 totalOeuvres: 20
 *                 mostFrequentArtist: "Leonardo da Vinci"
 *                 averageOeuvresPerArtist: 5
 *                 earliestCreationDate: "1503-08-21"
 *                 latestCreationDate: "1519-05-02"
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal server error
 */



module.exports = router;