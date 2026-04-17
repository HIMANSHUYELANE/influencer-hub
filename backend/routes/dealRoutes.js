const express = require('express');
const { createDeal, getUserDeals, initiateMockPayment, submitContent, reviewContent } = require('../controllers/dealController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/user', authMiddleware, getUserDeals);
router.post('/', authMiddleware, createDeal);

// Payment & Lifecycle endpoints
router.post('/:id/pay', authMiddleware, checkRole('brand'), initiateMockPayment);
router.post('/:id/submit-content', authMiddleware, checkRole('creator'), submitContent);
router.post('/:id/review', authMiddleware, checkRole('brand'), reviewContent);

module.exports = router;
