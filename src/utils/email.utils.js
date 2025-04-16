const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // ✅ Correct SMTP host
    port: 587,                    // ✅ Correct port
    secure: false,                // use TLS (true for 465, false for other ports)
    auth: {
      user: '8a91f9001@smtp-brevo.com', // ✅ Your Brevo SMTP Login
      pass: process.env.EMAIL_PASS,      // ✅ Use the password/token Brevo gave you
    },
  });

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body in HTML
 */
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Motorello" <roykuntal1213@gmail.com>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

module.exports = sendEmail;
