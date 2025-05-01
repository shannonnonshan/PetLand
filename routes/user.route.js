import express from 'express';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import auth from '../middlewares/auth.mdw.js';
import userService from '../services/user.service.js';
import configurePassportGoogle from '../controllers/passportGoogle.config.js';
import passport from 'passport';
import nodemailer from 'nodemailer';

const route = express.Router();
dotenv.config();

route.get('/login', function (req, res) {
    res.render('vwUser/login', {
        layout: 'account-layout'
    });
    
});

route.post('/login', async function (req, res) {
    let user = await userService.findByUsername(req.body.username);
    if(!user){
        return res.render('vwUser/login', {
            layout: 'account-layout',
            showErrors: true
        });
    }
    if (!bcrypt.compareSync(req.body.raw_password, user.password)) {
        return res.render('vwUser/login', {
            layout: 'account-layout',
            showErrors: true,
        });
    }
    req.session.auth = true;
    req.session.authUser = {
        name: user.name || user.username || null,
        id: user.id,
        email: user.email,
    };

    const retUrl = req.session.retUrl || '/';
    res.redirect(retUrl);
});


route.get('/register', function (req, res) {
    res.render('vwUser/register', {
        layout: 'account-layout'
    });
});

route.post('/register', async function (req, res) {
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
    console.log(req.body.raw_dob);
    const entity = {
        name: req.body.fullname,
        username: req.body.username,
        password: hash_password,
        phone: req.body.phone,
        gender: req.body.gender,
        email: req.body.email,
        createAt: Date.now()
    }
    const ret = await userService.add(entity);
    const retUrl = '/user/login'
    res.redirect(retUrl);
});

route.get('/is-available', async function (req, res) {
    const username = req.query.username;
    const user = await userService.findByUsername(username);
    if (!user) {
        return res.json(true);
    }
    res.json(false);
});

route.post('/logout', auth, function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    res.redirect('/');
});

configurePassportGoogle();
route.get('/login/googleAuth',
  passport.authenticate('google'));

route.get('/login/googleAuth/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function (req, res) {
    const user = req.user; 
    if (!user) {
      return res.redirect('/login');
     }
    req.session.auth = true;
    req.session.authUser = {
        name: user.name || user.username || null,
        id: user.id,
        email: user.email,
    };
    res.redirect('/');
})

route.get('/forgot-password', function (req, res) {
    res.render('vwUser/forgot-password', {
        layout: 'account-layout',
    });
});

route.post('/forgot-password', async function(req, res) {
    const email = req.body.email || '';
    const username = req.body.username || '';
    try {
        // Kiểm tra email tồn tại trong cơ sở dữ liệu
        const user = await userService.findByUsername(username);
        if (!user) {
            return res.render('vwUser/forgot-password', {
                layout: 'account-layout',
                errorMessage: 'Không có người dùng trong hệ thống',
            });
        }
        if (user.email !== email) {
            return res.render('vwUser/forgot-password', {
                layout: 'account-layout',
                errorMessage: 'Email không trùng khớp',
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expriteAt = new Date(Date.now() + 5 * 60 * 1000);
        const newOTP = {
            otp: otp, 
            expire_time: expriteAt, 
            email: email
        }   
        
        const ret = await userService.addOTP(newOTP);
        // Cấu hình gửi email qua Nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465, 
            secure: true,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_EMAIL_PW,
            },
        });
        // Nội dung email
        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: '[RESET PASSWORD] - PETLAND SUPPORT',
            text: `
          Hello,
          
          We received a request to reset the password for your Petland account.
          
          Your One-Time Password (OTP) is: ${otp}
          
          Please enter this code to reset your password. This OTP is valid for 10 minutes.
          
          If you did not request a password reset, please ignore this message or contact our support team.
          
          Thank you,
          The Petland Team
            `,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
              <h2 style="color: #2c3e50;">🔐 Password Reset Request</h2>
              <p>Hello,</p>
              <p>We received a request to reset the password for your <strong>Petland</strong> account.</p>
              <p style="font-size: 18px;">
                <strong>Your OTP Code:</strong> 
                <span style="color: #e74c3c; font-size: 24px; letter-spacing: 2px;">${otp}</span>
              </p>
              <p>This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
              <p>If you did not make this request, please ignore this email or contact our support team immediately.</p>
              <br/>
              <p>Thank you,<br/>
              <strong>The Petland Team</strong></p>
            </div>
            `
          };

        // Gửi email
        await transporter.sendMail(mailOptions);

        // Chuyển đến trang nhập OTP
        res.redirect(`/user/otp?email=${email}&&username=${username}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

route.get('/otp', function (req, res) {
    const email= req.query.email;
    const username = req.query.username
    res.render('vwUser/otp', {
        layout: 'account-layout',
        email: email,
        username: username
    });
});

route.post('/otp', async function (req, res) {
    const email = req.body.email || '';
    const username = req.body.username || '';
    const otp = req.body.otp || '';

    try {
        const otpRecord = await userService.findOTPByEmail(email);
        console.log(otpRecord);
        if (!otpRecord) {
            return res.render('vwUser/otp', {
                layout: 'account-layout',
                email,
                username,
                errorMessage: 'Hết hạn',
            });
        }
        if (parseInt(otp) !== otpRecord.otp) {
            return res.render('vwUser/otp', {
                layout: 'account-layout',
                email: email,
                username: username,
                errorMessage: 'Nhập sai mã OTP, yêu cầu nhập lại',
            });
        }
        const ret = await userService.delOTP(otp);
        res.redirect(`/user/reset-password?email=${email}&&username=${username}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

// Route POST reset-password (to handle resetting the password)
route.get('/reset-password', function (req, res) {
    const email = req.query.email || '';
    const username = req.query.username || '';
    res.render('vwUSer/reset-password', {
        layout: 'account-layout',
        email: email,
        username: username
    });
});

route.post('/reset-password', async function (req, res) {
    const email = req.body.email || '';
    const username = req.body.username || '';
    try {
        const hashedPassword = bcrypt.hashSync(req.body.raw_password, 8);
        const ret = await userService.updatePassword(email, username, hashedPassword);

        res.render('vwUser/login', {
            layout: 'account-layout',
            successMessage: 'Mật khẩu đã được thay đổi thành công.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
});

export default route;