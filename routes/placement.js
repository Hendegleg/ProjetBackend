const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placement');
const auth = require('../middlewares/auth')
router.get('/:id',auth.authMiddleware,auth.isAdmin, placementController.proposePlacementBySize);
router.put('/update/:id',auth.authMiddleware,auth.isAdmin, placementController.updateParticipantPosition);
router.delete('/delete/:id',auth.authMiddleware,auth.isAdmin, placementController.annulerPlacement);
module.exports = router;
