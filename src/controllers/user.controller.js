// src/controllers/user.controller.js
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
require('dotenv').config();

// ================== Multer Config ==================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/temp');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ================ View Profile =====================
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};

// ================ Update Profile ===================
exports.updateMyProfile = async (req, res) => {
  try {
    const updateFields = req.body;
    updateFields.updated_at = new Date();

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true }).select('-password');
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// ================ Change Password ==================
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.updated_at = new Date();
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password' });
  }
};

// ================ Upload Profile Image (Cloudinary) =============
exports.uploadProfileImage = [upload.single('profile_image'), async (req, res) => {
  try {
    const localFilePath = req.file.path;

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'profile_images'
    });

    // Remove local file
    fs.unlinkSync(localFilePath);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profile_image: result.secure_url, updated_at: new Date() },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'Profile image uploaded', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading profile image' });
  }
}];

// ================ Update Location ==================
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        updated_at: new Date()
      },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'Location updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating location' });
  }
};

// ================== Upload KYC Document ==================
exports.uploadKYCDocument = [
  upload.single('kyc_document'),
  async (req, res) => {
    try {
      const localFilePath = req.file.path;

      // Upload document to Cloudinary or any cloud storage service
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: 'kyc_documents',
      });

      // Remove local file after upload
      fs.unlinkSync(localFilePath);

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { kyc_document_url: result.secure_url, kyc_verified: false },
        { new: true }
      ).select('-password');

      res.status(200).json({
        message: 'KYC document uploaded successfully',
        user: updatedUser
      });
    } catch (err) {
      res.status(500).json({ message: 'Error uploading KYC document' });
    }
  }
];

// ================== Admin KYC Verification ==================
exports.verifyKYC = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mark the user as KYC verified and update verification timestamp
    user.kyc_verified = true;
    user.kyc_verified_at = Date.now();
    user.is_verified = user.phone_verified && user.kyc_verified;

    await user.save();

    res.status(200).json({ message: 'KYC verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying KYC' });
  }
};

// ================== Get KYC Document ==================
exports.getKYCDocument = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('kyc_document_url');

    if (!user || !user.kyc_document_url) {
      return res.status(404).json({ message: 'No KYC document found' });
    }

    res.status(200).json({ kyc_document_url: user.kyc_document_url });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving KYC document' });
  }
};


