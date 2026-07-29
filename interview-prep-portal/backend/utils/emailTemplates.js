// Email templates for interview notifications

// Template for mentor notification when student schedules interview
const mentorInterviewRequestTemplate = (studentName, studentEmail, date, time, type, studentNotes) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎓 New Mock Interview Request</h2>
        </div>
        <div class="content">
          <p>Dear Mentor,</p>
          <p>You have received a new mock interview request from a student:</p>
          
          <div class="details">
            <h3>Student Details:</h3>
            <p><strong>Name:</strong> ${studentName}</p>
            <p><strong>Email:</strong> ${studentEmail}</p>
          </div>
          
          <div class="details">
            <h3>Interview Details:</h3>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Type:</strong> ${type}</p>
            ${studentNotes ? `<p><strong>Student Notes:</strong> ${studentNotes}</p>` : ''}
          </div>
          
          <p>Please review this request and respond accordingly.</p>
          <p>You can approve or reject this interview request through your mentor dashboard.</p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL}/mentor-dashboard" class="button">View Request</a>
          </div>
          
          <div class="footer">
            <p>This is an automated email from Interview Preparation Portal</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for student confirmation email when interview is scheduled
const studentInterviewScheduledTemplate = (mentorName, mentorCompany, date, time, type, meetingLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #10b981; }
        .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>✅ Interview Scheduled Successfully</h2>
        </div>
        <div class="content">
          <p>Dear Student,</p>
          <p>Your mock interview has been scheduled successfully!</p>
          
          <div class="details">
            <h3>Mentor Details:</h3>
            <p><strong>Name:</strong> ${mentorName}</p>
            <p><strong>Company:</strong> ${mentorCompany}</p>
          </div>
          
          <div class="details">
            <h3>Interview Details:</h3>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Type:</strong> ${type}</p>
            ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
          </div>
          
          <p>Please make sure to join the interview on time. Prepare well and good luck!</p>
          
          ${meetingLink ? `
          <div style="text-align: center; margin-top: 20px;">
            <a href="${meetingLink}" class="button">Join Meeting</a>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>This is an automated email from Interview Preparation Portal</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for student rejection email
const studentInterviewRejectedTemplate = (mentorName, rejectionReason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #ef4444; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>❌ Interview Request Rejected</h2>
        </div>
        <div class="content">
          <p>Dear Student,</p>
          <p>Unfortunately, your mock interview request has been rejected by the mentor.</p>
          
          <div class="details">
            <h3>Rejection Details:</h3>
            <p><strong>Mentor:</strong> ${mentorName}</p>
            ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : '<p><strong>Reason:</strong> No specific reason provided</p>'}
          </div>
          
          <p>Please don't be discouraged. You can try scheduling with another mentor or choose a different time slot.</p>
          
          <div class="footer">
            <p>This is an automated email from Interview Preparation Portal</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for interview reminder
const interviewReminderTemplate = (mentorName, date, time, type, meetingLink) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #f59e0b; }
        .button { display: inline-block; padding: 12px 24px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>⏰ Interview Reminder</h2>
        </div>
        <div class="content">
          <p>Dear Student,</p>
          <p>This is a reminder that your mock interview is scheduled soon!</p>
          
          <div class="details">
            <h3>Interview Details:</h3>
            <p><strong>Mentor:</strong> ${mentorName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Type:</strong> ${type}</p>
            ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
          </div>
          
          <p>Please make sure to join on time and have your preparation materials ready.</p>
          
          ${meetingLink ? `
          <div style="text-align: center; margin-top: 20px;">
            <a href="${meetingLink}" class="button">Join Meeting</a>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>This is an automated email from Interview Preparation Portal</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  mentorInterviewRequestTemplate,
  studentInterviewScheduledTemplate,
  studentInterviewRejectedTemplate,
  interviewReminderTemplate,
};
