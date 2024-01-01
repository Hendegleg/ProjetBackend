const express = require('express');
const router = express.Router();
const auditionController = require('../controllers/audition');
const EvenementAudition= require('../models/evenementaudition');

/**
 * @swagger
 * components:
 *   schemas:
 *     Candidat:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *           description: Le nom du candidat
 *           example: timoumi
 *         prenom:
 *           type: string
 *           description: Le prénom du candidat
 *           example: wejden
 *         nom_jeune_fille:
 *           type: timoumi
 *           description: Nom de jeune fille du candidat
 *           example: wejden
 *         sexe:
 *           type: string
 *           description: Le sexe du candidat
 *           example: femme
 *         nationalite:
 *           type: string
 *           description: Nationalité du candidat
 *           example: tunisienne
 *         taille_en_m:
 *           type: string
 *           description: Taille du candidat
 *           example: 1.75
 *         email:
 *           type: string
 *           description: Adresse email du candidat
 *           example: ttwejden@gmail.com
 *         telephone:
 *           type: number
 *           description: Numéro de téléphone du candidat
 *           example: 26535343
 *         cinpassport:
 *           type: string
 *           description: Numéro de carte d'identité ou passeport du candidat
 *           example: 123
 *         date_naissance:
 *           type: string
 *           format: date
 *           description: Date de naissance du candidat
 *           example: 2000-06-21
 *         situationProfessionnelle:
 *           type: string
 *           description: Situation professionnelle du candidat
 *           example: Étudiante
 *         connaissances:
 *           type: string
 *           description: Connaissances du candidat
 *           example: Musique
 *         parraine:
 *           type: string
 *           description: Parrainage du candidat
 *           example: Oui
 *         activite:
 *           type: string
 *           description: Activité du candidat
 *           example: Chanteuse
 *         choeuramateur:
 *           type: string
 *           description: Participation à un chœur amateur par le candidat
 *           example: Oui
 *         estretenu:
 *           type: boolean
 *           description: Indique si le candidat est retenu
 *           example: true
 *         estConfirme:
 *           type: boolean
 *           description: Indique si le candidat est confirmé
 *           example: false
 *         signature:
 *           type: boolean
 *           description: Indique si le candidat a signé
 *           example: false
 *         estEngage:
 *           type: boolean
 *           description: Indique si le candidat est engagé
 *           example: false
 *         estPresent:
 *           type: boolean
 *           description: Indique si le candidat est présent
 *           example: false
 *         decisioneventuelle:
 *           type: string
 *           enum: ["retenu", "en attente", "refuse"]
 *           default: "en attente"
 *           description: Décision éventuelle pour le candidat
 *           example: en attente
 *         token:
 *           type: string
 *           description: Token associé au candidat
 *           example: 123
 */

/**
 * @swagger
 * tags:
 *   name: Auditions
 *   description: Opérations sur les auditions
 * 
 * components:
 *   schemas:
 *     Audition:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Identifiant auto-généré de l'audition
 *         heure_debut:
 *           type: string
 *           description: Heure de début de l'audition
 *         heure_fin:
 *           type: string
 *           description: Heure de fin de l'audition
 *         date_audition:
 *           type: string
 *           format: date
 *           description: Date de l'audition
 *         nombre_séance:
 *           type: number
 *           description: Nombre de séances
 *         dureeAudition:
 *           type: string
 *           description: Durée de l'audition
 *         candidat:
 *           $ref: '#/components/schemas/Candidat'
 *       example:
 *         _id: 12345
 *         heure_debut: "08:00"
 *         heure_fin: "10:00"
 *         date_audition: "2024-01-01"
 *         nombre_séance: 2
 *         dureeAudition: "2 heures"
 *         candidat:
 *           nom: wejden
 *           prenom: timoumi
 *           nom_jeune_fille: timoumi
 *           sexe: femme
 *           nationalite: tunisienne
 *           taille_en_m: 1.75
 *           email: wejden@gmail.com
 *           telephone: 26535343
 *           cinpassport: 123
 *           date_naissance: 2000-06-21
 *           situationProfessionnelle: Étudiante
 *           connaissances: Musique
 *           parraine: Oui
 *           activite: Chanteur
 *           choeuramateur: Oui
 *           estretenu: true
 *           estConfirme: false
 *           signature: false
 *           estEngage: false
 *           estPresent: false
 *           decisioneventuelle: en attente
 *           token: ABC123TOKEN
 * 
 *   responses:
 *     AuditionResponse:
 *       200:
 *         description: Succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Audition'
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Audition non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/auditions:
 *   post:
 *     summary: Créer une nouvelle audition
 *     tags: [Auditions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 *     responses:
 *       $ref: '#/components/responses/AuditionResponse'
 * 
 *   get:
 *     summary: Récupérer toutes les auditions
 *     tags: [Auditions]
 *     responses:
 *       $ref: '#/components/responses/AuditionResponse'
 */
/**
 * @swagger
 * /api/auditions/{id}:
 *   get:
 *     summary: Récupérer une audition par ID
 *     tags: [Auditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'audition à récupérer
 *     responses:
 *       $ref: '#/components/responses/AuditionResponse'
 * 
 *   patch:
 *     summary: Mettre à jour une audition par ID
 *     tags: [Auditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'audition à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 *     responses:
 *       $ref: '#/components/responses/AuditionResponse'
 * 
 *   delete:
 *     summary: Supprimer une audition par ID
 *     tags: [Auditions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'audition à supprimer
 *     responses:
 *       $ref: '#/components/responses/AuditionResponse'
 */




router.post('/', auditionController.createAudition);
router.get('/', auditionController.getAudition);
router.get('/:id', auditionController.getAuditionById);
router.patch('/:id', auditionController.updateAudition);
router.delete('/:id', auditionController.deleteAudition);





// Route pour générer le planning d'auditions
router.post('/generer-planning', auditionController.genererPlanification);


// Route pour cree les  auditions pour les candidats
//router.post('/creeAuditionsCandidats', auditionController.createAuditionsForCandidats);

// Route to generate and send audition plans
//router.post('/generateAndSendAuditionPlan', auditionController.generateAndSendAuditionPlan);

router.post('/lancerEvenementAudition', auditionController.lancerEvenementAudition);


module.exports = router;
