const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendMail = async (userData) => {
  const { email, username, password } = userData;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Pass,
    },
  });

  const mailOptions = {
    from: process.env.Email_User,
    to: email,
    subject: 'Welcome to Result आयो, your login details are available below',
    html: `
      <p>Your <strong>username</strong> : <strong>${username}</strong> and your <strong>password</strong> : <strong>${password}</strong>.</p>
    `,
  };
  

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, message: 'Mail sent successfully' };
  } catch (error) {
    console.log('Error sending email:', error);
    return { success: false, error: 'Error sending email' };
  }
};

module.exports = {
  sendMail,
};
