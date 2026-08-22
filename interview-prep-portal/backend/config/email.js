const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Helper to check if SendGrid is configured
const isSendGridConfigured = () => {
  const hasApiKey = process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key';
  
  console.log(`SendGrid Config Check - SENDGRID_API_KEY: ${hasApiKey ? 'SET' : 'NOT SET'}`);
  
  return hasApiKey;
};

// Send email function using SendGrid
const sendEmail = async (options) => {
  try {
    const configured = isSendGridConfigured();

    if (configured) {
      // Set SendGrid API key
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      console.log(`Using SendGrid service`);
      console.log(`Email service called - To: ${options.to}, Subject: ${options.subject}`);

      const msg = {
        to: options.to,
        from: process.env.EMAIL_FROM || process.env.SENDGRID_FROM || 'noreply@khushiportal.onrender.com',
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      const response = await sgMail.send(msg);
      console.log('✅ Email sent successfully via SendGrid');
      console.log('SendGrid response:', response[0].statusCode);

      return { success: true, messageId: response[0].headers['x-message-id'] };
    } else {
      console.error('SendGrid not configured. Please set SENDGRID_API_KEY environment variable.');
      return { success: false, error: 'SendGrid not configured' };
    }
  } catch (error) {
    console.error('❌ SendGrid email error:', error.message);
    if (error.response) {
      console.error('SendGrid error response:', error.response.body);
    }
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
