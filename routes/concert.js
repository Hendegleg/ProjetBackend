const express = require('express');
const router = express.Router();
const concertController = require('../controllers/concert');
const auth = require('../middlewares/auth');

const uploadFile = require('../middlewares/uploadFiles');
/**
 * @swagger
 * tags:
 *   name: Concerts
 *   description: Opérations sur les concerts
 * 
 * components:
 *   schemas:
 *     Concert:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Identifiant auto-généré du concert
 *         presence:
 *           type: string
 *           description: Présence au concert
 *         date:
 *           type: string
 *           format: date
 *           description: Date du concert
 *         lieu:
 *           type: string
 *           description: Lieu du concert
 *         heure:
 *           type: string
 *           description: Heure du concert
 *         programme:
 *           type: string
 *           description: Programme du concert
 *         planning:
 *           type: string
 *           description: Planning du concert
 *         nom_concert:
 *           type: string
 *           description: Nom du concert
 *       example:
 *         _id: 12345
 *         presence: "present"
 *         date: "2024-01-01"
 *         lieu: "Nom du lieu"
 *         heure: "20:00"
 *         programme: "Description du programme"
 *         planning: "Planning détaillé"
 *         nom_concert: "Nom du concert"
 * 
 *   responses:
 *     ConcertResponse:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Concert'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Concert non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/concerts:
 *   post:
 *     summary: Créer un nouveau concert
 *     tags: [Concerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Concert'
 *     responses:
 *       $ref: '#/components/responses/ConcertResponse'
 * 
 *   get:
 *     summary: Récupérer tous les concerts
 *     tags: [Concerts]
 *     responses:
 *       $ref: '#/components/responses/ConcertResponse'
 */

/**
 * @swagger
 * /api/concerts/{id}:
 *   put:
 *     summary: Mettre à jour un concert par ID
 *     tags: [Concerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du concert à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Concert'
 *     responses:
 *       $ref: '#/components/responses/ConcertResponse'
 * 
 *   delete:
 *     summary: Supprimer un concert par ID
 *     tags: [Concerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du concert à supprimer
 *     responses:
 *       $ref: '#/components/responses/ConcertResponse'
 */

/**
 * @swagger
 * /api/concerts/{id}/confirmerpresence:
 *   post:
 *     summary: Confirmer la présence à un concert
 *     tags: [Concerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du concert pour confirmer la présence
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: string
 *                 description: ID de l'utilisateur
 *     responses:
 *       $ref: '#/components/responses/ConcertResponse'
 */

// Routes pour gérer les concerts
router.post('/', auth.authMiddleware, auth.isAdmin, concertController.createConcert); 
router.get('/',auth.authMiddleware, auth.isAdmin, concertController.getAllConcerts); 
router.put('/:id', auth.authMiddleware, auth.isAdmin,concertController.updateConcert); 
router.delete('/:id', auth.authMiddleware, auth.isAdmin, concertController.deleteConcert); 
router.post('/:id/confirmerpresence', auth.authMiddleware, auth.isAdmin, concertController.confirmerpresenceConcert);


module.exports = router;