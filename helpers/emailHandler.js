import nodemailer from 'nodemailer';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export async function sendEmail(destination, subject, body, message) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destination,
    subject,
    text: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${destination}`);
    return message.reply(`✅ Email sent to ${destination}`);
  } catch (error) {
    console.log(error);
    return message.reply(`❌ Error sending email to ${destination}: ${error.message}`);
  }
}