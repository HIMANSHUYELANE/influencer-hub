const express = require('express');
const { updateProfile, getBrandById, getBrandProfileMe, uploadLogo } = require('../controllers/brandController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getBrandProfileMe);
router.get('/:id', getBrandById);

// Requires Authentication and Brand Role
router.post('/profile', authMiddleware, checkRole('brand'), updateProfile);
router.put('/profile', authMiddleware, checkRole('brand'), updateProfile);
router.post('/logo', authMiddleware, checkRole('brand'), upload.single('logo'), uploadLogo);

module.exports = router;
