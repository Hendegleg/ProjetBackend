const express = require('express');
const router = express.Router();
const UserController = require('../controllers/intervenants');
const auth = require ('../middlewares/auth')

router.post('/',auth.authMiddleware,auth.isAdmin ,UserController.createUser);

router.get('/', auth.authMiddleware,auth.isAdmin,UserController.getAllUsers);
router.get('/:userId',auth.authMiddleware,auth.isAdmin, UserController.getUserById);
router.put('/:userId', auth.authMiddleware,auth.isAdmin,UserController.updateUser);
router.delete('/:userId', auth.authMiddleware,auth.isAdmin,UserController.deleteUser);

module.exports = router;
