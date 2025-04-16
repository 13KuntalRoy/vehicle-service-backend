const jwt = require('jsonwebtoken');
require('dotenv').config();


// Load secrets from environment variables or use defaults (for dev only)
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET;

// Token expiry durations
const ACCESS_TOKEN_EXPIRY = '1h';      // 1 hour
const REFRESH_TOKEN_EXPIRY = '7d';     // 7 days
const RESET_TOKEN_EXPIRY = '15m';      // 15 minutes

/**
 * Generate Access Token
 * @param {Object} user - Must contain _id and role
 * @returns {string} Access Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate Refresh Token
 * @param {Object} user - Must contain _id
 * @returns {string} Refresh Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Verify Access Token
 * @param {string} token
 * @returns {Object} Decoded token data
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify Refresh Token
 * @param {string} token
 * @returns {Object} Decoded token data
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Generate Reset Token
 * @param {Object} user - Must contain _id and email
 * @returns {string} Reset Token
 */
const generateResetToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    JWT_RESET_SECRET,
    { expiresIn: RESET_TOKEN_EXPIRY }
  );
};

/**
 * Verify Reset Token
 * @param {string} token
 * @returns {Object} Decoded token data
 */
const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, JWT_RESET_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired reset token');
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateResetToken,
  verifyResetToken
};
