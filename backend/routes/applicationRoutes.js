const express = require('express');
const { applyToCampaign, getCreatorApplications, getBrandApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/creator', authMiddleware, checkRole('creator'), getCreatorApplications);
router.get('/brand/:campaignId', authMiddleware, checkRole('brand'), getBrandApplications);
router.post('/', authMiddleware, checkRole('creator'), applyToCampaign);
router.put('/:id/status', authMiddleware, updateApplicationStatus); // Logic within controller handles role

module.exports = router;
