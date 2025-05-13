// routes/faceAuth.routes.js
const express = require('express');
const router = express.Router();
const faceAuthController = require('../controllers/faceAuth.controller');

router.post('/enable', faceAuthController.enableFaceAuth);
router.post('/verify', faceAuthController.verifyFaceAuth);
router.post('/disable', faceAuthController.disableFaceAuth);

module.exports = router;
