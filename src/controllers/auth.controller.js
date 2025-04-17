const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken, generateResetToken, verifyResetToken } = require('../utils/jwt.utils');
const sendEmail = require('../utils/email.utils');

let refreshTokens = []; // You can replace this with DB or Redis

// Register User
exports.registerUser = async (req, res) => {
    const { first_name, last_name, email, phone_number, password, role, gender, dob } = req.body;
  
    // Validation: Check if all required fields are provided
    if (!first_name || !last_name || !email || !phone_number || !password || !role || !gender || !dob) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Step 1: Check if the user already exists (by email or phone)
      const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });
      if (existingUser) {
        return res.status(409).json({ message: 'Email or phone already registered' });
      }
  
      // Step 2: Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Step 3: Create new user
      const newUser = new User({
        first_name,
        last_name,
        email,
        phone_number,
        password: hashedPassword,
        role,
        gender,
        dob,
        is_verified: false,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      });
  
      // Step 4: Save the user to the database
      const savedUser = await newUser.save();
  
      // Step 5: Generate access and refresh tokens
      const accessToken = generateAccessToken(savedUser._id);
      const refreshToken = generateRefreshToken(savedUser._id);
  
      // Store refreshToken for future use
      refreshTokens.push(refreshToken);
  
      // Step 6: Send success response
      return res.status(201).json({
        message: 'User registered successfully',
        accessToken,
        refreshToken,
        user: {
          id: savedUser._id,
          name: `${savedUser.first_name} ${savedUser.last_name}`,
          email: savedUser.email,
          phone_number: savedUser.phone_number,
          role: savedUser.role,
          status: savedUser.status
        }
      });
    } catch (error) {
      console.error('Error in user registration:', error);
  
      // If any error occurs during the process, send a server error response
      return res.status(500).json({
        message: 'Server error, please try again later',
        error: error.message
      });
    }
  };

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone_number: emailOrPhone }]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    refreshTokens.push(refreshToken);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout User
exports.logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: 'Refresh token not valid' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Token expired' });

      const accessToken = generateAccessToken(decoded.userId);
      res.status(200).json({ accessToken });
    });
  } catch (err) {
    console.error('Refresh Token Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = generateResetToken(user._id);
    const resetLink = `https://yourfrontend.com/reset-password?token=${resetToken}`;

    await sendEmail(email, 'Reset Password', `
        <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f8f8f8;
                color: #333;
              }
              .email-container {
                width: 100%;
                max-width: 650px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                background-color: #1e2a47; /* Deep navy blue */
                color: #f1f1f1; /* Soft off-white */
                padding: 40px;
                text-align: center;
                border-radius: 12px 12px 0 0;
              }
              .email-header h1 {
                font-size: 36px;
                font-weight: 700;
                letter-spacing: 1px;
                margin: 0;
              }
              .email-header p {
                font-size: 20px;
                font-weight: 300;
                margin: 10px 0 0;
              }
              .email-content {
                padding: 40px;
                text-align: center;
              }
              .email-content p {
                font-size: 18px;
                color: #555;
                line-height: 1.7;
                margin: 15px 0;
                font-weight: 400;
              }
              .reset-link {
                display: inline-block;
                background-color:#981501; 
                color: #ffffff !important; /* Ensure the text is white */
                font-size: 20px;
                font-weight: 600;
                padding: 18px 35px;
                text-decoration: none;
                border-radius: 50px;
                margin-top: 30px;
                transition: all 0.3s ease;
                text-transform: uppercase;
              }
              .reset-link:hover {
                background-color: #1e2a47; /* Darker gold */
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
              }
              .footer {
                background-color: #f4f4f4; /* Light gray */
                color: #777;
                padding: 20px;
                text-align: center;
                border-radius: 0 0 12px 12px;
              }
              .footer p {
                font-size: 14px;
                font-weight: 300;
              }
              .footer a {
                color: #1e2a47; /* Deep navy blue */
                text-decoration: none;
                font-weight: 600;
              }
              .footer a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="email-header">
                <h1>Motorello</h1>
                <p>Password Reset</p>
              </div>
              <div class="email-content">
                <p>Dear User,</p>
                <p>We received a request to reset your password for your Motorello account. Please click the button below to reset your password:</p>
                <a href="${resetLink}" class="reset-link">Reset Your Password</a>
                <p>This link will expire in 15 minutes for your security. If you did not request a password reset, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 Motorello. All rights reserved.</p>
                <p>If you need assistance, visit our <a href="#">Help Center</a>.</p>
              </div>
            </div>
          </body>
        </html>
      `);
      

    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = verifyResetToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'Invalid token or user' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
// ================== OTP Generation ==================
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  };
  
  // ================== Send OTP ==================

  const sendOTP = async (phoneNumber, otp, type = 'verify') => {
    try {
      const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
  
      if (!FAST2SMS_API_KEY) {
        throw new Error('FAST2SMS API key not set in environment variables.');
      }
  
      // ✅ Clean phone number: remove +91 or 0 and any non-digit characters
      const cleanedNumber = phoneNumber.replace(/^(\+91|0)/, '').replace(/\D/g, '');
  
      // ✅ Message based on type
      const message =
        type === 'login'
          ? `Your OTP to login to Motorello is ${otp.toString()}`
          : `Your OTP to verify your phone number with Motorello is ${otp.toString()}`;
  
      const payload = {
        route: 'q',
        message,
        numbers: cleanedNumber,
      };
  
      const headers = {
        authorization: FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      };
  
      const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', payload, { headers });
  
      if (response.data.return === true) {
        console.log(`✅ OTP "${otp}" sent to ${cleanedNumber}`);
        return true;
      } else {
        console.error('❌ OTP send failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('🚨 Error sending OTP:', error.response?.data || error.message);
      return false;
    }
  };
   
  
  
  // ================== Start Phone Verification ==================
exports.startPhoneVerification = async (req, res) => {
    const { phone_number } = req.body;
  
    try {
      // Generate OTP
      const otp = generateOTP();
      const expiryTime = Date.now() + 10 * 60 * 1000; // OTP expiry time set to 10 minutes
  
      // Save OTP and its expiry time in the user's record
      const user = await User.findOne({ phone_number });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.otp = otp.toString();
      user.otp_expiry = new Date(expiryTime);
  
      await user.save();
  
      // Send OTP via Fast2SMS
      const isSent = await sendOTP(phone_number, otp);
  
      if (!isSent) {
        return res.status(500).json({ message: 'Error sending OTP' });
      }
  
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error starting phone verification' });
    }
  };
  
  // ================== Verify OTP ==================
exports.verifyOTP = async (req, res) => {
    const { phone_number, otp } = req.body;
  
    try {
      // Find user by phone number
      const user = await User.findOne({ phone_number });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if OTP is expired
      if (user.otp_expiry < Date.now()) {
        return res.status(400).json({ message: 'OTP expired' });
      }
  
      // Check if OTP is correct
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // OTP is valid, mark phone as verified
      user.phone_verified = true;
      user.otp = null; // Clear OTP after successful verification
      user.otp_expiry = null; // Clear OTP expiry time
  
      await user.save();
  
      res.status(200).json({ message: 'Phone number verified successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error verifying OTP' });
    }
  };


// ================== Start OTP Login ==================
exports.startOTPLogin = async (req, res) => {
    const { phone_number } = req.body; // Get phone number from the request body
  
    try {
      // Find user by phone number
      const user = await User.findOne({ phone_number });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate OTP
      const otp = generateOTP();
      const expiryTime = Date.now() + 10 * 60 * 1000; // OTP expiry time (10 minutes)
  
      // Save OTP and expiry time in the user record
      user.otp = otp.toString();
      user.otp_expiry = new Date(expiryTime);
      await user.save();
  
      // Send OTP to user via Fast2SMS
      const isSent = await sendOTP(phone_number, otp,'login');
  
      if (!isSent) {
        return res.status(500).json({ message: 'Error sending OTP' });
      }
  
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error starting OTP login' });
    }
  };
  
  // ================== Verify OTP and Login ==================
  exports.verifyOTPAndLogin = async (req, res) => {
    const { phone_number, otp } = req.body;
  
    try {
      // Find user by phone number
      const user = await User.findOne({ phone_number });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if OTP is expired
      if (user.otp_expiry < Date.now()) {
        return res.status(400).json({ message: 'OTP expired' });
      }
  
      // Check if OTP is correct
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // OTP is valid, generate JWT access and refresh tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

  
      // Clear OTP fields after successful login
      user.otp = null;
      user.otp_expiry = null;
      await user.save();
  
      res.status(200).json({
        message: 'Login successful',
        accessToken,
        refreshToken,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error verifying OTP' });
    }
  };

  // Generate random 6-digit OTP

// Send OTP to user's email
exports.sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    let user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    } else {
      user.otp = otp;
      user.otp_expiry = otpExpiry;
    }

    await user.save();

    // Send email using Nodemailer
    await sendEmail(email,'Verify Email', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Motorello OTP Verification</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f4f7;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 40px auto;
      padding: 30px 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #007BFF;
      margin: 0;
    }
    .header {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #111;
    }
    .message {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .otp-box {
      background-color: #f1f3f5;
      padding: 20px;
      border-radius: 8px;
      font-size: 26px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 4px;
      color: #007BFF;
      margin-bottom: 30px;
    }
    .footer {
      font-size: 13px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>Motorello</h1>
    </div>
    <div class="header">Verify Your Email Address</div>
    <div class="message">
      Thank you for signing up with <strong>Motorello</strong> — India’s trusted platform for vehicle services and gear parts.
      <br/><br/>
      Use the OTP below to verify your email address:
    </div>
    <div class="otp-box">${otp}</div>
    <div class="message">
      This code will expire in <strong>5 minutes</strong>. If you didn’t request this, please ignore this email.
    </div>
    <div class="footer">
      © Motorello 2025 • All rights reserved<br/>
      For support, contact us at <a href="mailto:support@motorello.in">support@motorello.in</a>
    </div>
  </div>
</body>
</html>
`);

    res.status(200).json({
      success: true,
      message: 'OTP sent to email successfully',
    });
  } catch (err) {
    console.error('🚨 sendEmailOtp error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
  }
};

// Verify OTP and issue tokens
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    const user = await User.findOne({ email });

    if (!user || !user.otp || !user.otp_expiry)
      return res.status(400).json({ success: false, message: 'No OTP request found' });

    if (new Date() > user.otp_expiry)
      return res.status(400).json({ success: false, message: 'OTP expired' });

    if (user.otp !== otp)
      return res.status(400).json({ success: false, message: 'Invalid OTP' });

    // OTP is valid, update flags and issue tokens
    user.email_verified = true;
    user.is_verified = true;
    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      tokens: {
        accessToken,
        refreshToken,
      },
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    console.error('🚨 verifyEmailOtp error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
  }
};