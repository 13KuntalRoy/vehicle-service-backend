const OTPAuth = require("otpauth");
const encode = require("hi-base32");
const QRCode = require("qrcode");
const crypto = require("crypto");
const users = require('../models/user.model');
const { generateAccessToken, generateRefreshToken} = require('../utils/jwt.utils');



// Generate a Base32 Secret
const generateBase32Secret = () => {
  const buffer = crypto.randomBytes(15);
  const base32 = encode(buffer).replace(/=/g, "").substring(0, 24);
  return base32;
};

// Endpoint to enable two-factor authentication (2FA)
exports.enable_2fa = async (req, res) => {
  const { email } = req.body;

  // Find or create the user (replace with database logic)
  let user = users.find((u) => u.email === email);
  if (!user) {
    user = { email, secret: "" };
    users.push(user);
  }

  // Generate a secret key for the user
  const base32_secret = generateBase32Secret();
  user.secret = base32_secret;

  // Generate a TOTP configuration
  const totp = new OTPAuth.TOTP({
    issuer: "YourSite.com",
    label: "YourSite",
    algorithm: "SHA1",
    digits: 6,
    secret: base32_secret,
  });

  // Generate the QR Code URL
  const otpauth_url = totp.toString();

  // Generate QR Code image as Data URL
  QRCode.toDataURL(otpauth_url, (err, qrUrl) => {
    if (err) {
      return res.status(500).json({
        status: "fail",
        message: "Error while generating QR Code",
      });
    }

    res.json({
      status: "success",
      data: {
        qrCodeUrl: qrUrl,
        secret: base32_secret,
      },
    });
  });
};

// Endpoint to verify the two-factor authentication (2FA) code
exports.verify_2fa = async (req, res) => {
  const { email, token } = req.body;

  // Find the user by username
  const user = users.find((u) => u.email === email);

  if (!user || !user.secret) {
    return res.status(404).send("User not found or 2FA not enabled");
  }

  // Verify the TOTP code
  const totp = new OTPAuth.TOTP({
    issuer: "YourSite.com",
    label: "YourSite",
    algorithm: "SHA1",
    digits: 6,
    secret: user.secret,
  });

  const delta = totp.validate({ token });
        // OTP is valid, generate JWT access and refresh tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  if (delta !== null) {
    res.json({
      status: "success",
      message: "Authentication successful",
      accessToken,
      refreshToken

    });
  } else {
    res.status(401).json({
      status: "fail",
      message: "Authentication failed",
    });
  }
};
