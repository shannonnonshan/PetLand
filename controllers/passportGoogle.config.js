import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import userService from '../services/user.service.js';

dotenv.config();

export default function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/user/login/googleAuth/callback",
        scope: ['profile', 'email']
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const email = profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

          // Tìm user theo tên hiển thị (displayName) hoặc email
          let user = await userService.findByUsername(profile.displayName);

          if (user) {
            // Nếu user đã tồn tại nhưng chưa có googleId, cập nhật googleId
            if (!user.googleId) {
              if (!user.googleId) {
                await User.findOneAndUpdate(
                    { username: profile.displayName }, 
                    { googleId: profile.id },         
                    { new: true }                       
                );
                }
            }
            // Xác thực thành công
            return done(null, user);
          } else {
            // Nếu không tìm thấy user, tạo user mới
            user = new User({
              googleId: profile.id,
              username: profile.displayName,
              email: email
            });
            await user.save();
            return done(null, user); 
          }
        } catch (error) {
          console.error('Error during Google authentication:', error);
          return done(error, null); // Xử lý lỗi
        }
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.username);  // Chỉ lưu trữ ID (hoặc username) của người dùng vào session
  });

  // Deserialize user: khôi phục thông tin người dùng từ session
  passport.deserializeUser(async function(username, done) {
    try {
      const user = await userService.findByUsername(username);  // Lấy thông tin người dùng từ DB bằng ID
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
