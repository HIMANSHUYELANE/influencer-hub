const express = require('express');
const { createDeal, getUserDeals } = require('../controllers/dealController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/user', authMiddleware, getUserDeals);
router.post('/', authMiddleware, createDeal);

module.exports = router;
