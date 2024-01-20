const express = require('express');
const router = express.Router();
const userController = require('../controllers/utilisateur');
const statusHistoryController = require('../controllers/statusHistory');

const eliminationController=require('../controllers/absenceElemination')
const Auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API operations related to users
 */

/**
 * @swagger
 * /users/ajouterStatus:
 *   post:
 *     summary: Add a status change for a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusChange'
 *     responses:
 *       201:
 *         description: Status change added successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get status history for a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               statusHistory:
 *                 - _id: "60a1f5f66b5f4b001d3478c5"
 *                   utilisateur: "60a1f5f66b5f4b001d3478c5"
 *                   ancienStatus: "choriste"
 *                   nouveauStatus: "choriste junior"
 *                   nbsaison: 3
 *                   date: "2022-05-16T12:30:00.000Z"
 *                 - _id: "60a1f5f66b5f4b001d3478c6"
 *                   utilisateur: "60a1f5f66b5f4b001d3478c5"
 *                   ancienStatus: "inactive"
 *                   nouveauStatus: "active"
 *                   nbsaison: 4
 *                   date: "2022-06-20T14:45:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}/profile:
 *   get:
 *     summary: Get the profile of a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               user:
 *                 _id: "60a1f5f66b5f4b001d3478c5"
 *                 nom: "John"
 *                 prenom: "Doe"
 *                 email: "john.doe@example.com"
 *                 role: "choriste"
 *       401:
 *         description: Unauthorized - Invalid token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StatusChange:
 *       type: object
 *       properties:
 *         utilisateur:
 *           type: string
 *         ancienStatus:
 *           type: string
 *         nouveauStatus:
 *           type: string
 *         nbsaison:
 *           type: number
 *         date:
 *           type: string
 *           format: date-time
 *       required:
 *         - utilisateur
 *         - ancienStatus
 *         - nouveauStatus
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         // Define properties for the User object
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - password
 *         // Add other required properties
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StatusHistory:
 *       type: object
 *       properties:
 *         // Define properties for the Status History object
 *       required:
 *         - utilisateur
 *         - ancienStatus
 *         - nouveauStatus
 *         - date
 */



router.post('/ajouterStatus',Auth.authMiddleware,Auth.isAdminOrChoriste , statusHistoryController.addStatusChange);
router.get('/:id',Auth.authMiddleware,Auth.isAdmin , statusHistoryController.getStatusHistoryForUser);

router.get('/:id/profile',Auth.authMiddleware,Auth.isAdminOrChoriste ,userController.getProfile );


module.exports = router;
//eliminationController.getChoristesNominés,eliminationController.getChoristesÉliminés,