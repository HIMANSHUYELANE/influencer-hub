const Deal = require('../models/Deal');
const Application = require('../models/Application');
const CreatorProfile = require('../models/CreatorProfile');
const BrandProfile = require('../models/BrandProfile');
const Campaign = require('../models/Campaign');
// Placeholder for Razorpay require once installed: const Razorpay = require('razorpay');

const createDeal = async (req, res) => {
  const { applicationId } = req.body;
  try {
    const application = await Application.findById(applicationId).populate('campaignId');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.status !== 'confirmed_by_creator') {
      return res.status(400).json({ message: 'Creator must confirm the application before creating a deal.' });
    }

    const existingDeal = await Deal.findOne({ applicationId });
    if (existingDeal) return res.status(400).json({ message: 'Deal already exists for this application.' });

    const deal = new Deal({ 
      applicationId,
      budget: application.campaignId?.budget || 0,
      status: 'pending_payment',
      paymentDetails: { status: 'pending' }
    });
    await deal.save();

    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const initiateMockPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const deal = await Deal.findById(id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    
    // In production, this would create a Razorpay Order
    // For mock, we immediately simulate a successful payment held in escrow
    
    deal.status = 'in_progress';
    deal.paymentDetails.status = 'escrow_held';
    deal.paymentDetails.razorpayOrderId = 'mock_order_' + Date.now();
    await deal.save();

    res.json({ message: 'Payment simulated. Deal in progress.', deal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitContent = async (req, res) => {
  const { id } = req.params;
  const { contentUrl } = req.body;
  try {
    const deal = await Deal.findById(id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.status !== 'in_progress' && deal.status !== 'revision_requested') {
      return res.status(400).json({ message: 'Cannot submit content at this stage.' });
    }

    deal.contentUrl = contentUrl;
    deal.status = 'in_review';
    await deal.save();

    res.json({ message: 'Content submitted for review.', deal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const reviewContent = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'approve' or 'reject'
  
  try {
    const deal = await Deal.findById(id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.status !== 'in_review') {
      return res.status(400).json({ message: 'Deal is not waiting for review.' });
    }

    if (action === 'approve') {
      deal.status = 'completed';
      deal.paymentDetails.status = 'released';
      // Here you would trigger Razorpay payouts API/Route transfer in production
    } else if (action === 'reject') {
      deal.status = 'revision_requested';
    } else {
      return res.status(400).json({ message: 'Invalid action.' });
    }

    await deal.save();
    res.json({ message: `Content ${action}ed.`, deal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserDeals = async (req, res) => {
  try {
    let applications;
    if (req.user.role === 'creator') {
      const creatorProfile = await CreatorProfile.findOne({ userId: req.user.id });
      applications = await Application.find({ creatorId: creatorProfile._id });
    } else {
      const brandProfile = await BrandProfile.findOne({ userId: req.user.id });
      const campaigns = await Campaign.find({ brandId: brandProfile._id });
      const campaignIds = campaigns.map(c => c._id);
      applications = await Application.find({ campaignId: { $in: campaignIds } });
    }

    const applicationIds = applications.map(a => a._id);
    const deals = await Deal.find({ applicationId: { $in: applicationIds } }).populate({
      path: 'applicationId',
      populate: { path: 'campaignId creatorId' }
    });

    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDeal, getUserDeals, initiateMockPayment, submitContent, reviewContent };
