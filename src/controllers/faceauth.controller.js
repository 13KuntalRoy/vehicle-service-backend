// faceAuthController.js
const faceapi = require('face-api.js');
const path = require('path');
const { Canvas, Image, ImageData } = require('canvas');
const User = require('../models/user.model');
const cloudinary = require('../utils/cloudinary');
// Configure face-api.js with node-canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load face-api models (adjust paths as needed)
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, '../fmodels'));
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, '../fmodels'));
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, '../fmodels'));
  console.log("Face API models loaded successfully.");
}
loadModels();

// ✅ Enable Face Authentication (Register Face)
const enableFaceAuth = async (req, res) => {
  try {
    const { userId, image } = req.body;
    if (!userId || !image) {
      return res.status(400).json({ message: "User ID and image are required." });
    }

    // Load user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(`data:image/png;base64,${image}`, {
      folder: "face_auth",
      public_id: `face_${userId}`,
      overwrite: true
    });

    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary." });
    }

    // Convert base64 image to buffer for face detection
    const imageBuffer = Buffer.from(image, 'base64');
    const img = await faceapi.bufferToImage(imageBuffer);

    // Detect face and extract descriptor
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return res.status(400).json({ message: "No face detected in the image." });
    }

    // Save face descriptor and image URL in the database
    user.face_data = {
      image_url: uploadResult.secure_url,
      descriptor: Array.from(detection.descriptor)
    };
    await user.save();

    res.status(200).json({
      message: "Face authentication enabled successfully.",
      image_url: uploadResult.secure_url
    });
  } catch (error) {
    console.error("Error enabling face authentication:", error);
    res.status(500).json({ message: "Failed to enable face authentication." });
  }
};

// ✅ Verify Face Authentication (Login with Face)
const verifyFaceAuth = async (req, res) => {
  try {
    const { email, image } = req.body;
    if (!email || !image) {
      return res.status(400).json({ message: "Email and image are required." });
    }

    // Load user from the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.face_data || !user.face_data.descriptor) {
      return res.status(400).json({ message: "Face authentication is not enabled for this user." });
    }

    // Convert base64 image to buffer
    const imageBuffer = Buffer.from(image, 'base64');
    const img = await faceapi.bufferToImage(imageBuffer);

    // Detect face and extract descriptor
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return res.status(400).json({ message: "No face detected in the image." });
    }

    // Convert stored descriptor and detected descriptor for comparison
    const storedDescriptor = new Float32Array(user.face_data.descriptor);
    const detectedDescriptor = detection.descriptor;

    // Calculate Euclidean distance between the two descriptors
    const distance = faceapi.euclideanDistance(storedDescriptor, detectedDescriptor);
    const threshold = 0.6; // Adjust this threshold for strictness

    if (distance <= threshold) {
      res.status(200).json({ message: "Face verified successfully.", userId: user._id });
    } else {
      res.status(401).json({ message: "Face verification failed. Distance too high." });
    }
  } catch (error) {
    console.error("Error verifying face authentication:", error);
    res.status(500).json({ message: "Failed to verify face authentication." });
  }
};

// ✅ Disable Face Authentication (Delete Face Data)
const disableFaceAuth = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Load user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete Cloudinary Image if exists
    if (user.face_data && user.face_data.image_url) {
      const publicId = user.face_data.image_url.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(`face_auth/${publicId}`);
    }

    // Remove face data from user
    user.face_data = undefined;
    await user.save();

    res.status(200).json({ message: "Face authentication disabled successfully." });
  } catch (error) {
    console.error("Error disabling face authentication:", error);
    res.status(500).json({ message: "Failed to disable face authentication." });
  }
};

// ✅ Exporting Controller
module.exports = {
  enableFaceAuth,
  verifyFaceAuth,
  disableFaceAuth
};
