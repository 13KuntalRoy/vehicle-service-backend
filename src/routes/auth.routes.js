const express = require('express');
const router = express.Router();
const { 
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  startPhoneVerification, verifyOTP,startOTPLogin,verifyOTPAndLogin,sendEmailOtp,verifyEmailOtp 
} = require('../controllers/auth.controller');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user and returns the access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               phone_number:
 *                 type: string
 *                 example: "+1234567890"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               role:
 *                 type: string
 *                 example: "user"
 *               gender:
 *                 type: string
 *                 example: "male"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60c72b2f9b1d8b1a5c8c8e3c"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phone_number:
 *                       type: string
 *                       example: "+1234567890"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       409:
 *         description: Email or phone already registered
 *       500:
 *         description: Server error
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     description: Logs in a user and returns access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60c72b2f9b1d8b1a5c8c8e3c"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phone_number:
 *                       type: string
 *                       example: "+1234567890"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     description: Logs out a user by removing the refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Server error
 */
router.post('/logout', logoutUser);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Uses the refresh token to generate a new access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Access token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       403:
 *         description: Refresh token not valid or expired
 *       500:
 *         description: Server error
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Sends a password reset link to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Resets the user's password using a valid reset token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.post('/reset-password', resetPassword);
// Route to start phone verification (send OTP)
router.post('/start-phone-verification', startPhoneVerification);

// Route to verify OTP (user only)
router.post('/verify-otp', verifyOTP);

// Route to initiate OTP login (send OTP)
router.post('/start-otp-login',startOTPLogin);

// Route to verify OTP and log the user in
router.post('/verify-otp-login', verifyOTPAndLogin);

// Route to send OTP to user's email
router.post('/send-email-otp', sendEmailOtp);
// Route to verify OTP for email verification
router.post('/verify-email-otp', verifyEmailOtp);


module.exports = router;
