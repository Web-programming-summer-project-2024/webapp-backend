const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Sends an email using Nodemailer.
 * 
 * @param {Object} options - The email options.
 * @param {string} options.email - The recipient's email address.
 * @param {string} options.subject - The email subject.
 * @param {string} options.message - The email message.
 * @returns {Promise<void>}
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    // from: process.env.EMAIL_FROM,  // temporarily disabling this because I can not setup no-reply email right now.
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
