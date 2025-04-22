// models/User.js
import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://donnade:thanhvyneh@petland.lruap6s.mongodb.net/petland?retryWrites=true&w=majority&appName=Petland')
  .then(() => console.log('Connected!'));

const userSchema = new mongoose.Schema({
  googleId: String,
  id: { type: String, default: () => randomUUID() },
  name: String,
  username: String,
  createAt: { type: Date, default: Date.now },
  password: String,
  gender: String,
  address: String,
  phone: String,
  email: String,
  avatar: String
}, { collection: 'User' });

const otpSchema = new mongoose.Schema({
  id: { type: String, default: () => randomUUID() },
  email: String,
  otp: Number,
  expire_time: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL: xóa ngay khi expire_time < Date.now()
  }
}, { collection: 'OtpUser' });

const User = mongoose.model('User', userSchema);
const OtpUser = mongoose.model('OtpUser', otpSchema);

// ✅ Export cả hai model theo cách đặt tên
export { User, OtpUser };
