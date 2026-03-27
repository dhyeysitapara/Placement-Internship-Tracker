const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Application = require('./models/Application');

const startScheduler = () => {
  // Transporter setup for Nodemailer
  // Note: To make this work in real life, the user must provide EMAIL_USER and EMAIL_PASS in .env
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other service
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password',
    },
  });

  // Runs every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Running upcoming interview check for emails...');
    try {
      const now = new Date();
      const in48h = new Date();
      in48h.setHours(in48h.getHours() + 48);

      // Find apps with upcoming rounds that haven't been notified yet
      // Also populate the 'user' field so we can get their email address
      const apps = await Application.find({
        'interviewRounds': {
          $elemMatch: {
            date: { $gte: now, $lte: in48h },
            emailNotified: false
          }
        }
      }).populate('user', 'name email');

      if (apps.length === 0) {
        console.log('[Cron] No unnotified upcoming interviews found.');
        return;
      }

      let emailsSent = 0;

      for (const app of apps) {
        let appUpdated = false;

        for (const round of app.interviewRounds) {
          const d = new Date(round.date);
          if (d >= now && d <= in48h && !round.emailNotified) {
            
            // Only send if we have a valid user email
            if (app.user && app.user.email && process.env.EMAIL_USER) {
              const hoursLeft = Math.round((d - now) / 36e5);
              const mailOptions = {
                from: process.env.EMAIL_USER,
                to: app.user.email,
                subject: `Reminder: Upcoming Interview at ${app.company} in ~${hoursLeft} hours!`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #8B0020;">Placement Tracker Reminder</h2>
                    <p>Hi ${app.user.name},</p>
                    <p>This is a quick reminder that you have an upcoming interview round!</p>
                    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #8B0020; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #333;">${app.company}</h3>
                      <p style="margin: 5px 0;"><strong>Role:</strong> ${app.jobRole}</p>
                      <p style="margin: 5px 0;"><strong>Round:</strong> ${round.roundType}</p>
                      <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${d.toLocaleString()}</p>
                    </div>
                    ${round.notes ? `<p><strong>Notes:</strong> ${round.notes}</p>` : ''}
                    <p>Good luck!</p>
                    <p style="font-size: 12px; color: #888; margin-top: 30px;">Sent automatically by your Placement Tracker App.</p>
                  </div>
                `
              };

              try {
                await transporter.sendMail(mailOptions);
                console.log(`[Cron] 📧 Sent email to ${app.user.email} for ${app.company}`);
                emailsSent++;
              } catch (mailErr) {
                console.error(`[Cron] Failed to send email to ${app.user.email}:`, mailErr.message);
                // Continue to the next round even if email fails, but don't mark as notified
                continue; 
              }
            }

            // Mark as notified whether email was sent or skipped (if NO EMAIL_USER set, we still mark it to avoid log spam)
            round.emailNotified = true;
            appUpdated = true;
          }
        }

        if (appUpdated) {
          await app.save();
        }
      }
      
      console.log(`[Cron] Finished check. ${emailsSent} reminder email(s) sent.`);
    } catch (err) {
      console.error('[Cron] Error during scheduled check:', err.message);
    }
  });

  console.log('✅ Cron scheduler started (checks every hour for upcoming interviews with email notifications).');
};

module.exports = { startScheduler };
