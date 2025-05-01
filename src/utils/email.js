// services/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// this will let you know if your SMTP config is good
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email server setup error:", err);
  } else {
    console.log("✅ Email server is ready to take messages");
  }
});

const sendEmail = async (to, subject, html) => {
  // 1) Validate recipient
  if (!to) {
    throw new Error("No recipient email address provided to sendEmail()");
  }

  // 2) Single sendMail call
  const mailOptions = {
    from: `YASH TOMAR <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  // 3) Log useful info
  console.log("✅ Email sent:", info.response);
  console.log("📨 Message ID:", info.messageId);

  return info;
};

module.exports = sendEmail;
