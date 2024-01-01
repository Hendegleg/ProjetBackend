const express = require('express');
const router = express.Router()
const uploadFiles = require('../middlewares/uploadFiles');
const programController = require('../controllers/programme');


/**
 * @swagger
 * components:
 *   schemas:
 *     Oeuvre:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Identifiant auto-généré de l'oeuvre
 *         titre:
 *           type: string
 *           description: Titre de l'oeuvre
 *         compositeurs:
 *           type: string
 *           description: Compositeur(s) de l'oeuvre
 *         arrangeurs:
 *           type: string
 *           description: Arrangeur(s) de l'oeuvre
 *         annee:
 *           type: string
 *           description: Année de l'oeuvre
 *         genre:
 *           type: string
 *           description: Genre de l'oeuvre
 *         paroles:
 *           type: string
 *           description: Paroles de l'oeuvre
 *         partition:
 *           type: string
 *           description: Partition de l'oeuvre
 *         requiresChoir:
 *           type: boolean
 *           description: Indique si l'oeuvre nécessite un chœur
 *           example: true
 * 
 *     Programme:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Identifiant auto-généré du programme
 *         nom_programme:
 *           type: string
 *           description: Nom du programme
 *         oeuvres:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Oeuvre'
 * 
 *   responses:
 *     ProgrammeResponse:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Programme'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Programme non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/programmes:
 *   post:
 *     summary: Créer un nouveau programme ou ajouter depuis un fichier Excel
 *     tags: [Programmes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Programme'
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', programController.addProgram);
router.post('/byfile', uploadFiles , programController.addProgramFromExcel);


module.exports = router;