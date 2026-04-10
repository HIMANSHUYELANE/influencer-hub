const BrandProfile = require('../models/BrandProfile');

const updateProfile = async (req, res) => {
  const { businessName, website, description, logo } = req.body;
  try {
    let profile = await BrandProfile.findOne({ userId: req.user.id });
    if (profile) {
      profile.businessName = businessName || profile.businessName;
      profile.website = website || profile.website;
      profile.description = description || profile.description;
      profile.logo = logo || profile.logo;
      await profile.save();
    } else {
      profile = new BrandProfile({
        userId: req.user.id,
        businessName,
        website,
        description,
        logo
      });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBrandById = async (req, res) => {
  try {
    const brand = await BrandProfile.findById(req.params.id).populate('userId', 'email');
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBrandProfileMe = async (req, res) => {
  try {
    const brand = await BrandProfile.findOne({ userId: req.user.id }).populate('userId', 'email');
    if (!brand) return res.status(404).json({ message: 'Brand profile not found' });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile, getBrandById, getBrandProfileMe };
