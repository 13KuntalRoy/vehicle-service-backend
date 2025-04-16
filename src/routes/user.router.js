const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const adminMiddleware = require('../middlewares/admin.middleware');

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     description: Returns the profile details of the authenticated user, excluding the password.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60b8d2954f2b0b10c8e4e89f
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 profile_image:
 *                   type: string
 *                   example: "https://res.cloudinary.com/dlqh8ltba/image/upload/v1657891001/profile_images/john.jpg"
 *                 location:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "Point"
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [12.9716, 77.5946]
 *       500:
 *         description: Error retrieving profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving profile"
 */
router.get('/profile', authMiddleware, userController.getMyProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     description: Updates the profile of the authenticated user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe Updated"
 *               email:
 *                 type: string
 *                 example: "john.doe.updated@example.com"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       500:
 *         description: Error updating profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating profile"
 */
router.put('/profile', authMiddleware, userController.updateMyProfile);

/**
 * @swagger
 * /api/user/password:
 *   put:
 *     summary: Change the authenticated user's password
 *     description: Changes the password for the authenticated user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password changed successfully"
 *       400:
 *         description: Old password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Old password is incorrect"
 *       500:
 *         description: Error changing password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error changing password"
 */
router.put('/password', authMiddleware, userController.changePassword);

/**
 * @swagger
 * /api/user/profile-image:
 *   post:
 *     summary: Upload a profile image for the authenticated user
 *     description: Uploads and stores the user's profile image using Cloudinary.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile image uploaded"
 *       500:
 *         description: Error uploading profile image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error uploading profile image"
 */
router.post('/profile-image', authMiddleware, userController.uploadProfileImage);

/**
 * @swagger
 * /api/user/location:
 *   put:
 *     summary: Update the authenticated user's location
 *     description: Updates the location of the authenticated user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 12.9716
 *               longitude:
 *                 type: number
 *                 example: 77.5946
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Location updated"
 *       500:
 *         description: Error updating location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating location"
 */
router.put('/location', authMiddleware, userController.updateLocation);

// Route to upload KYC document (user only)
router.post('/upload-kyc', authMiddleware, userController.uploadKYCDocument);

// Route to get KYC document (user only)
router.get('/get-kyc', authMiddleware, userController.getKYCDocument);

// Route to verify KYC document (admin only)
router.put('/verify-kyc/:userId', authMiddleware, adminMiddleware, userController.verifyKYC);

module.exports = router;
