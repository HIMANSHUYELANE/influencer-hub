const express = require('express');
const { updateProfile, getAllCreators, getCreatorById, getCreatorProfileMe } = require('../controllers/creatorController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getCreatorProfileMe);
router.get('/', getAllCreators);
router.get('/:id', getCreatorById);

// Requires Authentication and Creator Role
router.post('/profile', authMiddleware, checkRole('creator'), updateProfile);
router.put('/profile', authMiddleware, checkRole('creator'), updateProfile);

module.exports = router;
