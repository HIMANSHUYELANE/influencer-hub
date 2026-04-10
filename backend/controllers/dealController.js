const Deal = require('../models/Deal');
const Application = require('../models/Application');
const CreatorProfile = require('../models/CreatorProfile');
const BrandProfile = require('../models/BrandProfile');
const Campaign = require('../models/Campaign');

const createDeal = async (req, res) => {
  const { applicationId } = req.body;
  try {
    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Ensure application is confirmed by creator before creating a deal
    if (application.status !== 'confirmed_by_creator') {
      return res.status(400).json({ message: 'Creator must confirm the application before creating a deal.' });
    }

    const existingDeal = await Deal.findOne({ applicationId });
    if (existingDeal) return res.status(400).json({ message: 'Deal already exists for this application.' });

    const deal = new Deal({ applicationId });
    await deal.save();

    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserDeals = async (req, res) => {
  try {
    // This needs to find applications related to the user (either brand or creator)
    // For simplicity, we'll look up by role
    let applications;
    if (req.user.role === 'creator') {
      const creatorProfile = await CreatorProfile.findOne({ userId: req.user.id });
      applications = await Application.find({ creatorId: creatorProfile._id });
    } else {
      const brandProfile = await BrandProfile.findOne({ userId: req.user.id });
      // This is slightly complex since deals are on applications
      // We'll first find all campaigns by this brand, then all applications for those campaigns
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

module.exports = { createDeal, getUserDeals };
