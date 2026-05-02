const mongoose = require('mongoose');
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

const createPackageCheckout = async (req, res) => {
  try {
    const { creatorId, packageTier } = req.body;
    
    // Validations
    if (req.user.role !== 'brand') {
      return res.status(403).json({ message: 'Only brands can purchase packages.' });
    }

    const brandProfile = await BrandProfile.findOne({ userId: req.user.id });
    if (!brandProfile) return res.status(404).json({ message: 'Brand profile not found.' });

    const creator = await CreatorProfile.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found.' });
    }

    // Fallback mock pricing for testing if the creator hasn't set it up
    let pkg = creator.pricing && creator.pricing[packageTier] ? creator.pricing[packageTier] : null;
    
    if (!pkg || !pkg.price || pkg.price <= 0) {
      // Provide a mock package for testing purposes
      pkg = {
        price: packageTier === 'premium' ? 10000 : (packageTier === 'standard' ? 5000 : 2500),
        description: `Mock ${packageTier} package deliverables for testing.`,
        deliveryDays: 5,
        revisions: 2
      };
    }

    // Check for existing open package deal to prevent duplicate active orders
    const existingDeal = await Deal.findOne({
      originType: 'package',
      brandId: brandProfile._id,
      creatorId: creator._id,
      packageTier,
      status: { $nin: ['completed', 'disputed'] }
    });

    if (existingDeal) {
      return res.status(409).json({ message: 'You already have an active order for this package.' });
    }

    // Create the Deal with originType: 'package'
    const deal = new Deal({
      originType: 'package',
      applicationId: new mongoose.Types.ObjectId(), // Bypass unique index crash
      brandId: brandProfile._id,
      creatorId: creator._id,
      packageTier,
      packageSnapshot: pkg,
      budget: pkg.price,
      status: 'pending_payment',
      paymentDetails: { status: 'pending' }
    });

    await deal.save();
    res.status(201).json(deal);
  } catch (error) {
    console.error("Package Checkout Error:", error);
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

    // Trigger Chat Creation: Only when payment is held
    const Conversation = require('../models/Conversation');
    const Message = require('../models/Message');

    const existingConversation = await Conversation.findOne({ dealId: deal._id });
    if (!existingConversation) {
      // Find User IDs for both participants
      let brandUserId, creatorUserId;

      if (deal.originType === 'package') {
        const brand = await BrandProfile.findById(deal.brandId);
        const creator = await CreatorProfile.findById(deal.creatorId);
        brandUserId = brand.userId;
        creatorUserId = creator.userId;
      } else {
        const app = await Application.findById(deal.applicationId).populate('campaignId');
        const campaign = await Campaign.findById(app.campaignId);
        const brand = await BrandProfile.findById(campaign.brandId);
        const creator = await CreatorProfile.findById(app.creatorId);
        brandUserId = brand.userId;
        creatorUserId = creator.userId;
      }

      const conversation = new Conversation({
        dealId: deal._id,
        participants: [brandUserId, creatorUserId],
        participantModel: 'User'
      });
      await conversation.save();

      // System Welcome Message
      const welcome = new Message({
        conversationId: conversation._id,
        senderId: brandUserId, // System messages could use a null/admin ID, but we'll use brand as initiator
        content: "Payment secured. Chat is now active for this collaboration."
      });
      await welcome.save();
    }

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
    let applicationIds = [];
    let creatorId, brandId;

    if (req.user.role === 'creator') {
      const creatorProfile = await CreatorProfile.findOne({ userId: req.user.id });
      if (creatorProfile) {
        creatorId = creatorProfile._id;
        const applications = await Application.find({ creatorId: creatorProfile._id });
        applicationIds = applications.map(a => a._id);
      }
    } else {
      const brandProfile = await BrandProfile.findOne({ userId: req.user.id });
      if (brandProfile) {
        brandId = brandProfile._id;
        const campaigns = await Campaign.find({ brandId: brandProfile._id });
        const campaignIds = campaigns.map(c => c._id);
        const applications = await Application.find({ campaignId: { $in: campaignIds } });
        applicationIds = applications.map(a => a._id);
      }
    }

    // Now find deals that either match the applications (Campaign deals) OR match the brandId/creatorId directly (Package deals)
    const query = { $or: [] };
    if (applicationIds.length > 0) query.$or.push({ applicationId: { $in: applicationIds } });
    if (creatorId) query.$or.push({ creatorId });
    if (brandId) query.$or.push({ brandId });
    
    if (query.$or.length === 0) return res.json([]);

    const deals = await Deal.find(query)
      .populate({
        path: 'applicationId',
        populate: { path: 'campaignId creatorId' }
      })
      .populate('creatorId')
      .populate('brandId');

    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDeal, createPackageCheckout, getUserDeals, initiateMockPayment, submitContent, reviewContent };
