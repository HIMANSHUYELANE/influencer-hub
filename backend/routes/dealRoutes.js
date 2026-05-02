const express = require('express');
const { createDeal, createPackageCheckout, getUserDeals, initiateMockPayment, submitContent, reviewContent } = require('../controllers/dealController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/user', authMiddleware, getUserDeals);
router.post('/', authMiddleware, createDeal);
router.post('/package-checkout', authMiddleware, createPackageCheckout);

// Payment & Lifecycle endpoints
router.post('/:id/pay', authMiddleware, checkRole('brand'), initiateMockPayment);
router.post('/:id/submit-content', authMiddleware, checkRole('creator'), submitContent);
router.post('/:id/review', authMiddleware, checkRole('brand'), reviewContent);

module.exports = router;
