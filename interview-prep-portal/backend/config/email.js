const nodemailer = require('nodemailer');

// Helper to check if credentials are set and are not default placeholders
const isSMTPConfigured = () => {
  const hasUser = process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com';
  const hasPass = (process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your_app_password') || 
                  (process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD !== 'your_app_password');
  
  console.log(`SMTP Config Check - EMAIL_USER: ${hasUser ? 'SET' : 'NOT SET'}`);
  console.log(`SMTP Config Check - EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET' : 'NOT SET'}`);
  console.log(`SMTP Config Check - EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET'}`);
  console.log(`SMTP Config Check - EMAIL_HOST: ${process.env.EMAIL_HOST || 'NOT SET'}`);
  console.log(`SMTP Config Check - EMAIL_PORT: ${process.env.EMAIL_PORT || 'NOT SET'}`);
  
  return hasUser && hasPass;
};

// Send email function (resilient to credentials/network issues)
const sendEmail = async (options) => {
  try {
    let transporter;
    const configured = isSMTPConfigured();

    if (configured) {
      // Use Gmail service with family: 4 to force IPv4
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        },
        // Force IPv4 connection
        family: 4,
        connectionTimeout: 15000,
        greetingTimeout: 5000,
        socketTimeout: 15000
      });
      
      console.log(`Using Gmail service with IPv4 (family: 4)`);
      console.log(`Email user: ${process.env.EMAIL_USER}`);
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
    
    // Skip verification on Render due to IPv6 issues, try direct send
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: %s', info.messageId);
    console.log('Gmail response details:', {
      accepted: info.accepted,
      rejected: info.rejected,
      envelope: info.envelope,
      response: info.response
    });

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
