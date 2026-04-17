const CreatorProfile = require('../models/CreatorProfile');

const updateProfile = async (req, res) => {
  const { name, bio, niche, socialLinks, followerCount, responseTime } = req.body;
  try {
    let profile = await CreatorProfile.findOne({ userId: req.user.id });
    if (profile) {
      profile.name = name || profile.name;
      profile.bio = bio || profile.bio;
      profile.niche = niche || profile.niche;
      profile.socialLinks = socialLinks || profile.socialLinks;
      profile.followerCount = followerCount !== undefined ? followerCount : profile.followerCount;
      profile.responseTime = responseTime || profile.responseTime;
      await profile.save();
    } else {
      profile = new CreatorProfile({
        userId: req.user.id,
        name,
        bio,
        niche,
        socialLinks,
        followerCount,
        responseTime
      });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
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
    
    profile.profilePicture = req.file.path;
    await profile.save();
    
    res.json({ profilePicture: profile.profilePicture });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, getAllCreators, getCreatorById, getCreatorProfileMe, uploadAvatar };
