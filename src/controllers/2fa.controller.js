const OTPAuth = require("otpauth");
const encode = require("hi-base32");
const QRCode = require("qrcode");
const crypto = require("crypto");
const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt.utils');

// Generate a Base32 Secret
const generateBase32Secret = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode.encode(buffer).replace(/=/g, "").substring(0, 24);
  return base32;
};

// Endpoint to enable two-factor authentication (2FA)
exports.enable_2fa = async (req, res) => {
  const { email,password} = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: "fail", message: "User not found" });
        // Verify password
    if (!compareSync(password, user.password)) {
            return res.status(401).json({ status: "fail", message: "Incorrect password" });
          }

    // Generate a secret key for the user
    const base32_secret = generateBase32Secret();
    user.secret = base32_secret;
    user.two_factor_enabled = true;
    await user.save();

    // Generate a TOTP configuration
    const totp = new OTPAuth.TOTP({
      issuer: "motorello.com",
      label: email,
      algorithm: "SHA256",
      digits: 6,
      secret: base32_secret,
    });

    const otpauth_url = totp.toString();

    // Generate QR Code
    const qrUrl = await QRCode.toDataURL(otpauth_url);

    res.json({
      status: "success",
      data: { qrCodeUrl: qrUrl, secret: base32_secret },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error enabling 2FA", error: error.message });
  }
};

// Endpoint to verify the two-factor authentication (2FA) code
exports.verify_2fa = async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.secret || !user.two_factor_enabled) {
      return res.status(404).json({ status: "fail", message: "User not found or 2FA not enabled" });
    }

    const totp = new OTPAuth.TOTP({
      issuer: "motorello.com",
      label: email,
      algorithm: "SHA256",
      digits: 6,
      secret: user.secret,
    });

    const delta = totp.validate({ token });

    if (delta !== null) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({
        status: "success",
        message: "Authentication successful",
        accessToken,
        refreshToken
      });
    } else {
      res.status(401).json({ status: "fail", message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error verifying 2FA", error: error.message });
  }
};
