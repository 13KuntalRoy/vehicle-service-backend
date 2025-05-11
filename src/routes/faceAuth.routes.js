const express = require("express");
const router = express.Router();
const faceauth = require("../controllers/faceauth.controller"); // Adjust the path as necessary

// Route for enabling face authentication (uploading face image)
router.post("/enable-faceauth", faceauth.enable_faceauth);

// Route for verifying face authentication
router.post("/verify-faceauth", faceauth.verify_faceauth);

module.exports = router;
