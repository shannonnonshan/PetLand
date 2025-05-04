// utils/mailer.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PW
  }
});

export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: '"Pet Donation"',
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};
