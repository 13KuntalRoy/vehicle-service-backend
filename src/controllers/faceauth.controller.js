const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt.utils');

const bcrypt = require('bcryptjs');
const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require('../utils/cloudinary');
const faceapi = require('face-api.js');
const fs = require("fs");
const path = require("path");

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

// Load face-api.js models (SSD Mobilenet is best for this)
async function loadFaceApiModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./fmodels');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./fmodels');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./fmodels');
}

// Enable Face Authentication (Store Face Descriptor)
exports.enable_faceauth = [upload.single("face_image"), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: "fail", message: "User not found" });

    if (!bcrypt.compare(password, user.password)) {
      return res.status(401).json({ status: "fail", message: "Incorrect password" });
    }

    if (!req.file) return res.status(400).json({ status: "fail", message: "Face image required" });

    // Load face-api.js models
    await loadFaceApiModels();

    // Read and process image using sharp
    const imageBuffer = fs.readFileSync(req.file.path);
    const processedImage = await sharp(imageBuffer).resize(200, 200).toBuffer();

    // Convert image buffer to base64 for face-api.js
    const base64Image = `data:image/jpeg;base64,${processedImage.toString('base64')}`;
    const image = await faceapi.fetchImage(base64Image);

    // Detect face and generate descriptor
    const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
      return res.status(400).json({ status: "fail", message: "No face detected in the image" });
    }

    const faceDescriptor = Array.from(detection.descriptor);

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { folder: "face_auth" });

    // Save descriptor and image URL in user data
    user.face_data = { image_url: result.secure_url, descriptor: faceDescriptor };
    await user.save();

    res.json({ status: "success", message: "Face Authentication enabled", image_url: result.secure_url });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error enabling Face Authentication", error: error.message });
  }
}];

// Verify Face Authentication (Compare Face Descriptor)
exports.verify_faceauth = [upload.single("face_image"), async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.face_data) return res.status(404).json({ status: "fail", message: "Face Authentication not enabled" });

    if (!req.file) return res.status(400).json({ status: "fail", message: "Face image required" });

    // Load face-api.js models
    await loadFaceApiModels();

    // Read and process image using sharp
    const imageBuffer = fs.readFileSync(req.file.path);
    const processedImage = await sharp(imageBuffer).resize(200, 200).toBuffer();

    // Convert image buffer to base64 for face-api.js
    const base64Image = `data:image/jpeg;base64,${processedImage.toString('base64')}`;
    const image = await faceapi.fetchImage(base64Image);

    // Detect face and generate descriptor
    const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
      return res.status(400).json({ status: "fail", message: "No face detected in the image" });
    }

    const uploadedDescriptor = Array.from(detection.descriptor);
    const storedDescriptor = user.face_data.descriptor;

    // Calculate Euclidean distance between the two descriptors
    const distance = faceapi.euclideanDistance(storedDescriptor, uploadedDescriptor);

    if (distance < 0.6) { // Threshold (0.6) can be adjusted
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      res.json({ status: "success", message: "Face Authentication successful", accessToken, refreshToken });
    } else {
      res.status(401).json({ status: "fail", message: "Face Authentication failed" });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error verifying Face Authentication", error: error.message });
  }
}];
