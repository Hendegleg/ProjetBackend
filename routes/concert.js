const express = require('express');
const router = express.Router();
const concertController = require('../controllers/concert');
const uploadFile = require('../middlewares/uploadFiles');

  
  /**
   * @swagger
   * tags:
   *   name: Concerts
   *   description: Operations related to concerts
   * 
   * /concert:
   *   post:
   *     summary: Create a new concert
   *     description: Creates a new concert with the provided data.
   *     tags:
   *       - Concerts
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Concert'
   *     responses:
   *       200:
   *         description: Successful response
   *       500:
   *         description: Internal server error
   *
   *   get:
   *     summary: Get all concerts
   *     description: Returns a list of all concerts.
   *     tags:
   *       - Concerts
   *     responses:
   *       200:
   *         description: Successful response
   *       500:
   *         description: Internal server error
   *
   *   put:
   *     summary: Update a concert
   *     description: Updates a concert with the provided data.
   *     tags:
   *       - Concerts
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the concert to be updated
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Concert'
   *     responses:
   *       200:
   *         description: Successful response
   *       500:
   *         description: Internal server error
   *
   *   delete:
   *     summary: Delete a concert
   *     description: Deletes a concert with the provided ID.
   *     tags:
   *       - Concerts
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the concert to be deleted
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response
   *       500:
   *         description: Internal server error
   *
   * /concert/{id}/confirmerpresence:
   *   post:
   *     summary: Confirm presence for a concert
   *     description: Confirms the presence of a chorister for the specified concert.
   *     tags:
   *       - Concerts
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the concert
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response
   *       500:
   *         description: Internal server error
   *
   * /concert/{id}/confirmedChoristes:
   *   get:
   *     summary: Get confirmed choristers for a concert
   *     description: Returns a list of choristers confirmed for the specified concert.
   *     tags:
   *       - Concerts
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the concert
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response
   *       500:
   *         description: Internal server error
   *
   * /concert/{id}/ajouterpresence:
   *   post:
   *     summary: Add manual presence for a concert
   *     description: Adds manual presence for a chorister in the specified concert.
   *     tags:
   *       - Concerts
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the concert
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response
   *       500:
   *         description: Internal server error
   *
   * /concert/{id}/indiquerconfirmation:
   *   post:
   *     summary: Indicate presence confirmation for a concert
   *     description: Indicates the presence confirmation for a chorister in the specified concert.
   *     tags:
   *       - Concerts
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID of the concert
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response
   *       500:
   *         description: Internal server error
   *
   * /concerts/statistics:
   *   get:
   *     summary: Get concert statistics
   *     description: Returns statistics for all concerts.
   *     tags:
   *       - Concerts
   *     responses:
   *       200:
   *         description: Successful response
   *       500:
   *         description: Internal server error
   */
// Routes pour gérer les concerts
router.post('/', concertController.createConcert);
router.get('/', concertController.getAllConcerts); 
router.put('/:id', concertController.updateConcert); 
router.delete('/:id', concertController.deleteConcert); 
router.post('/:id/confirmerpresence', concertController.confirmerpresenceConcert);

router.get('/:id/confirmedChoristes', concertController.getConfirmedChoristesForConcert);
router.post('/:id/ajouterpresence', concertController.ajouterPresenceManuelle);
router.post('/:id/indiquerconfirmation', concertController.indiquerpresenceConcert);
router.get('/concerts/statistics', concertController.getConcertStatistics);

module.exports = router;