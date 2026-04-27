const CreatorProfile = require('../models/CreatorProfile');
const { imagekit } = require('../middleware/uploadMiddleware');

const updateProfile = async (req, res) => {
  const { 
    name, age, bio, location, niche, expertise, 
    portfolioLink, pricing, followerCount, responseTime 
  } = req.body;
  try {
    const updateData = {
      name,
      age,
      bio,
      location,
      niche,
      expertise,
      portfolioLink,
      followerCount,
      responseTime
    };

    if (pricing) {
      updateData.pricing = pricing;
    }

    const profile = await CreatorProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(profile);
  } catch (error) {
    console.error('Creator Profile Update Error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllCreators = async (req, res) => {
  try {
    const creators = await CreatorProfile.find().populate('userId', 'email');
    res.json(creators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCreatorById = async (req, res) => {
  try {
    const creator = await CreatorProfile.findById(req.params.id).populate('userId', 'email');
    if (!creator) return res.status(404).json({ message: 'Creator not found' });
    res.json(creator);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCreatorProfileMe = async (req, res) => {
  try {
    let creator = await CreatorProfile.findOne({ userId: req.user.id }).populate('userId', 'email');
    if (!creator) {
      creator = new CreatorProfile({
        userId: req.user.id,
        name: `Creator-${req.user.id.substring(req.user.id.length - 4)}`
      });
      await creator.save();
      creator = await CreatorProfile.findOne({ userId: req.user.id }).populate('userId', 'email');
    }
    res.json(creator);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const profile = await CreatorProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Creator profile not found' });
    
    const result = await imagekit.upload({
      file: req.file.buffer, // Buffer from multer.memoryStorage
      fileName: `avatar_${req.user.id}_${Date.now()}`,
      folder: '/influencers_hub_profiles'
    });
    
    profile.profilePicture = result.url;
    await profile.save();
    
    res.json({ profilePicture: profile.profilePicture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, getAllCreators, getCreatorById, getCreatorProfileMe, uploadAvatar };
