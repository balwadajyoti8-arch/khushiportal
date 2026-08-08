const nodemailer = require('nodemailer');

// Helper to check if credentials are set and are not default placeholders
const isSMTPConfigured = () => {
  return (
    process.env.EMAIL_USER &&
    process.env.EMAIL_USER !== 'your_email@gmail.com' &&
    (process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD) &&
    process.env.EMAIL_PASS !== 'your_app_password' &&
    process.env.EMAIL_PASSWORD !== 'your_app_password'
  );
};

// Send email function (resilient to credentials/network issues)
const sendEmail = async (options) => {
  try {
    let transporter;
    const configured = isSMTPConfigured();

    if (configured) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS,
        },
      });
      console.log(`Using configured Gmail SMTP: ${process.env.EMAIL_USER}`);
      console.log(`Email configuration check - EMAIL_USER: ${process.env.EMAIL_USER ? 'SET' : 'NOT SET'}`);
      console.log(`Email configuration check - EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET'}`);
      console.log(`Email configuration check - EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET' : 'NOT SET'}`);
      console.log(`Email configuration check - EMAIL_FROM: ${process.env.EMAIL_FROM || 'NOT SET'}`);
    } else {
      console.log('Gmail SMTP credentials not configured. Generating temporary Ethereal test SMTP account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
    
    const mailOptions = {
      from: configured 
        ? (process.env.EMAIL_FROM || process.env.EMAIL_USER) 
        : 'Interview Prep Portal <noreply@interviewportal.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    console.log(`Email service called - To: ${options.to}, Subject: ${options.subject}`);
    
    // Verify transporter connection before sending
    if (configured) {
      try {
        await transporter.verify();
        console.log('SMTP connection verified successfully');
      } catch (verifyError) {
        console.error('SMTP connection verification failed:', verifyError.message);
        throw verifyError;
      }
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: %s', info.messageId);

    if (!configured) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('\n====================================================================');
      console.log('✉️ EMAIL PREVIEW URL (Ethereal Email):');
      console.log(previewUrl);
      console.log('====================================================================\n');
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error logged (transaction saved successfully):', error.message);
    // Return false instead of throwing to prevent database/transaction rollbacks
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
