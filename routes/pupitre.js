const express = require('express');
const router = express.Router()
const pupitreController = require ("../controllers/pupitre")

router.post('/:pupitreId/chefs', pupitreController.assignLeadersToPupitre)

module.exports = router;