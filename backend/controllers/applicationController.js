const Application = require('../models/Application');
const CreatorProfile = require('../models/CreatorProfile');
const Campaign = require('../models/Campaign');
const BrandProfile = require('../models/BrandProfile');
const Notification = require('../models/Notification');

const applyToCampaign = async (req, res) => {
  const { campaignId, message } = req.body;
  try {
    const creatorProfile = await CreatorProfile.findOne({ userId: req.user.id });
    if (!creatorProfile) {
      return res.status(404).json({ message: 'Creator profile not found. Please create one first.' });
    }

    const existingApplication = await Application.findOne({ campaignId, creatorId: creatorProfile._id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this campaign.' });
    }

    const application = new Application({
      campaignId,
      creatorId: creatorProfile._id,
      message
    });
    await application.save();

    // Notify the brand that a new application was received (non-blocking)
    try {
      const campaign = await Campaign.findById(campaignId).populate('brandId');
      if (campaign?.brandId?.userId) {
        await Notification.create({
          userId: campaign.brandId.userId,
          message: `${creatorProfile.name} applied to your campaign "${campaign.title}".`
        });
      }
    } catch (notifError) {
      console.error('Notification creation failed (non-critical):', notifError.message);
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCreatorApplications = async (req, res) => {
  try {
    const creatorProfile = await CreatorProfile.findOne({ userId: req.user.id });
    if (!creatorProfile) return res.status(404).json({ message: 'Creator not found' });

    const applications = await Application.find({ creatorId: creatorProfile._id }).populate('campaignId');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBrandApplications = async (req, res) => {
  try {
    const applications = await Application.find({ campaignId: req.params.campaignId }).populate('creatorId');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ['accepted', 'rejected', 'confirmed_by_creator'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
  }

  try {
    const application = await Application.findById(req.params.id)
      .populate({ path: 'campaignId', populate: { path: 'brandId' } })
      .populate('creatorId');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Step 1: Only a brand can accept or reject an application
    if (status === 'accepted' || status === 'rejected') {
      if (req.user.role !== 'brand') {
        return res.status(403).json({ message: 'Only brands can accept or reject applications.' });
      }
      if (application.status !== 'pending') {
        return res.status(400).json({ message: 'Only pending applications can be accepted or rejected.' });
      }
    }

    // Step 2: Only a creator can confirm, and only after brand has accepted
    if (status === 'confirmed_by_creator') {
      if (req.user.role !== 'creator') {
        return res.status(403).json({ message: 'Only creators can confirm applications.' });
      }
      if (application.status !== 'accepted') {
        return res.status(400).json({ message: 'Application must be accepted by the brand first.' });
      }
    }

    application.status = status;
    await application.save();

    // Send notifications (non-blocking)
    try {
      const campaignTitle = application.campaignId?.title || 'a campaign';
      if (status === 'accepted' || status === 'rejected') {
        // Notify the creator
        const creatorUserId = application.creatorId?.userId;
        if (creatorUserId) {
          await Notification.create({
            userId: creatorUserId,
            message: `Your application for "${campaignTitle}" has been ${status}.`
          });
        }
      } else if (status === 'confirmed_by_creator') {
        // Notify the brand
        const brandProfile = application.campaignId?.brandId;
        if (brandProfile?.userId) {
          await Notification.create({
            userId: brandProfile.userId,
            message: `A creator has confirmed their collaboration for "${campaignTitle}". A deal is ready to be created.`
          });
        }
      }
    } catch (notifError) {
      console.error('Notification creation failed (non-critical):', notifError.message);
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyToCampaign, getCreatorApplications, getBrandApplications, updateApplicationStatus };
