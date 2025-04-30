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
})

transporter.verify((error, success) => {
  if (error) {
    console.log(error)
  } else {
    console.log("Email server is ready to take messages")
  }
}
)

const sendEmail = async (to, subject, html) => { 
  try {
    const info = await transporter.sendMail({
      from: `YASH TOMAR <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,

    })

    const result = await transporter.sendMail(sendEmail)
    console.log("✅ Email sent:", result.response)

    console.log('Message sent: %s', info.messageId)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  }
  catch (error) {
    console.error('Error sending email:', error)
  }
}

module.exports = sendEmail