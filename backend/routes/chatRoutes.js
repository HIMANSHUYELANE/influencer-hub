const express = require('express');
const { getMessagesByDeal, sendMessage } = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:dealId', authMiddleware, getMessagesByDeal);
router.post('/:dealId', authMiddleware, sendMessage);

module.exports = router;
