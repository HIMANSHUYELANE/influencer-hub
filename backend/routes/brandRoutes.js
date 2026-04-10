const express = require('express');
const { updateProfile, getBrandById, getBrandProfileMe } = require('../controllers/brandController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getBrandProfileMe);
router.get('/:id', getBrandById);

// Requires Authentication and Brand Role
router.post('/profile', authMiddleware, checkRole('brand'), updateProfile);
router.put('/profile', authMiddleware, checkRole('brand'), updateProfile);

module.exports = router;
