const nodemailer = require('nodemailer');
const mailgun = require('mailgun-js');

// Helper to check if Mailgun is configured
const isMailgunConfigured = () => {
  const hasApiKey = process.env.MAILGUN_API_KEY && process.env.MAILGUN_API_KEY !== 'your_mailgun_api_key';
  const hasDomain = process.env.MAILGUN_DOMAIN && process.env.MAILGUN_DOMAIN !== 'your_mailgun_domain';
  
  console.log(`Mailgun Config Check - MAILGUN_API_KEY: ${hasApiKey ? 'SET' : 'NOT SET'}`);
  console.log(`Mailgun Config Check - MAILGUN_DOMAIN: ${hasDomain ? 'SET' : 'NOT SET'}`);
  
  return hasApiKey && hasDomain;
};

// Send email function using Mailgun
const sendEmail = async (options) => {
  try {
    const configured = isMailgunConfigured();

    if (configured) {
      // Use Mailgun for email sending
      const mg = mailgun({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
      });

      console.log(`Using Mailgun service`);
      console.log(`Email service called - To: ${options.to}, Subject: ${options.subject}`);

      const data = {
        from: process.env.EMAIL_FROM || `noreply@${process.env.MAILGUN_DOMAIN}`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      const body = await mg.messages().send(data);
      console.log('✅ Email sent successfully via Mailgun:', body.id);
      console.log('Mailgun response:', body);

      return { success: true, messageId: body.id };
    } else {
      console.error('Mailgun not configured. Please set MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.');
      return { success: false, error: 'Mailgun not configured' };
    }
  } catch (error) {
    console.error('❌ Mailgun email error:', error.message);
    console.error('Error details:', error);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
