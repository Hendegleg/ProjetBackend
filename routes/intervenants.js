const express = require('express');
const router = express.Router();
const UserController = require('../controllers/intervenants');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Opérations sur les utilisateurs
 * 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         nom:
 *           type: string
 *           description: The user's last name
 *         prenom:
 *           type: string
 *           description: The user's first name
 *         email:
 *           type: string
 *           description: The user's email address
 *       example:
 *         _id: 12345
 *         nom: Doe
 *         prenom: John
 *         email: john@example.com
 * 
 *   responses:
 *     UserResponse:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: Utilisateur créé avec succès
 *       '400':
 *         description: Requête incorrecte
 *       '401':
 *         description: Non autorisé
 *       '500':
 *         description: Erreur interne du serveur
 * 
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       $ref: '#/components/responses/UserResponse'
 */

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à récupérer
 *     responses:
 *       $ref: '#/components/responses/UserResponse'
 * 
 *   put:
 *     summary: Mettre à jour un utilisateur par ID
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       $ref: '#/components/responses/UserResponse'
 * 
 *   delete:
 *     summary: Supprimer un utilisateur par ID
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       $ref: '#/components/responses/UserResponse'
 */

router.post('/', auth.authMiddleware, auth.isAdmin, UserController.createUser);
router.get('/', auth.authMiddleware, auth.isAdmin, UserController.getAllUsers);
router.get('/:userId', auth.authMiddleware, auth.isAdmin, UserController.getUserById);
router.put('/:userId', auth.authMiddleware, auth.isAdmin, UserController.updateUser);
router.delete('/:userId', auth.authMiddleware, auth.isAdmin, UserController.deleteUser);

module.exports = router;
