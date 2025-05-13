const multer = require('multer');
const path = require('path');
const cloudinary = require('../utils/cloudinary');
const User = require('../models/user.model');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const { createCanvas, loadImage } = require('canvas');

// Patch face-api.js to use the canvas package in Node.js
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load Face API Models
async function loadModels() {
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, '../fmodels'));
    await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, '../fmodels'));
    await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, '../fmodels'));
    console.log("Face API models loaded successfully.");
  } catch (error) {
    console.error("Error loading face-api.js models:", error);
  }
}

// Load models when the server starts
loadModels();

// Set up Multer storage for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image'); // 'image' is the name of the field in the form-data

// Enable Face Authentication (Register Face)
const enableFaceAuth = async (req, res) => {
  try {
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "File upload error", error: err });
      }

      const { email } = req.body;
      if (!email || !req.file) {
        return res.status(400).json({ message: "User email and image file are required." });
      }

      // Load user from the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Upload image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload_stream(
        {
          folder: "face_auth",
          public_id: `face_${user._id}`,
          overwrite: true,
          resource_type: "image",
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Failed to upload image to Cloudinary.", error });
          }

          if (result && result.secure_url) {
            try {
              // Convert Buffer to Image using canvas
              const img = await loadImage(req.file.buffer); // Load image from buffer

              // Detect face and extract face descriptor using face-api.js
              const detection = await faceapi
                .detectSingleFace(img)
                .withFaceLandmarks()
                .withFaceDescriptor();

              if (!detection) {
                return res.status(400).json({ message: "No face detected in the image." });
              }

              // Save face descriptor and image URL in the database
              user.face_data = {
                image_url: result.secure_url,
                descriptor: Array.from(detection.descriptor) // Save descriptor for comparison
              };
              await user.save();

              res.status(200).json({
                message: "Face authentication enabled successfully.",
                image_url: result.secure_url
              });
            } catch (error) {
              console.error("Error processing face data:", error);
              res.status(500).json({ message: "Failed to process face data." });
            }
          }
        }
      );

      // Write the uploaded file buffer to the Cloudinary upload stream
      uploadResult.end(req.file.buffer);
    });
  } catch (error) {
    console.error("Error enabling face authentication:", error);
    res.status(500).json({ message: "Failed to enable face authentication." });
  }
};

// Enable Face Authentication (Verify Face)
const verifyFaceAuth = async (req, res) => {
  try {
    const { email, imageBuffer } = req.body;
    if (!email || !imageBuffer) {
      return res.status(400).json({ message: "Email and image are required." });
    }

    // Load user from the database
    const user = await User.findOne({ email });
    if (!user || !user.face_data) {
      return res.status(404).json({ message: "User not found or face data not registered." });
    }

    // Convert Buffer to Image using canvas
    const img = await loadImage(imageBuffer); // Load image from buffer

    // Detect face and extract face descriptor from the uploaded image
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      return res.status(400).json({ message: "No face detected in the image." });
    }

    // Compare the detected face descriptor with the user's saved descriptor
    const faceMatcher = new faceapi.FaceMatcher(user.face_data.descriptor);
    const match = faceMatcher.findBestMatch(detection.descriptor);

    if (match && match._label === "unknown") {
      return res.status(400).json({ message: "Face does not match." });
    }

    res.status(200).json({ message: "Face authentication successful." });
  } catch (error) {
    console.error("Error verifying face authentication:", error);
    res.status(500).json({ message: "Failed to verify face authentication." });
  }
};

// Disable Face Authentication (Delete Face Data)
const disableFaceAuth = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "User email is required." });
    }

    // Load user from the database
    const user = await User.findOne({ email });
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

// Export Controller Functions
module.exports = {
  enableFaceAuth,
  verifyFaceAuth,
  disableFaceAuth
};
