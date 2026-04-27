const Campaign = require('../models/Campaign');
const BrandProfile = require('../models/BrandProfile');

const createCampaign = async (req, res) => {
  const { title, description, niche, budget, requirements } = req.body;
  try {
    const brandProfile = await BrandProfile.findOne({ userId: req.user.id });
    if (!brandProfile) {
      return res.status(404).json({ message: 'Brand profile not found. Please create one first.' });
    }

    const campaign = new Campaign({
      brandId: brandProfile._id,
      title,
      description,
      niche,
      budget,
      requirements
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCampaigns = async (req, res) => {
  try {
    const filter = {};
    if (req.query.niche) filter.niche = req.query.niche;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.brandId) filter.brandId = req.query.brandId;
    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 }).populate('brandId', 'businessName logo');
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('brandId', 'businessName website description logo');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyCampaigns = async (req, res) => {
  try {
    const brandProfile = await BrandProfile.findOne({ userId: req.user.id });
    if (!brandProfile) {
      return res.status(404).json({ message: 'Brand profile not found' });
    }
    const campaigns = await Campaign.find({ brandId: brandProfile._id }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCampaign, getAllCampaigns, getCampaignById, getMyCampaigns };
