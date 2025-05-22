import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Tạo transporter dùng Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PW
  }
});

// Hàm dùng chung để gửi email với tiêu đề người gửi tuỳ chọn
const sendCustomEmail = async (to, subject, html, senderName = "Pet Service") => {
  const mailOptions = {
    from: `"${senderName}" <${process.env.MY_EMAIL}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

// Các hàm chuyên biệt gọi lại hàm chung với tên phù hợp
export const sendEmail = (to, subject, html) =>
  sendCustomEmail(to, subject, html, "Pet Donation");

export const sendServiceEmail = (to, subject, html) =>
  sendCustomEmail(to, subject, html, "Pet Service");

export const sendEmailRegister = (to, subject, html) =>
  sendCustomEmail(to, subject, html, "Account Registration");

export const sendEmailResetPassword = (to, subject, html) =>
  sendCustomEmail(to, subject, html, "Reset Password");
