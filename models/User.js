import { randomUUID } from 'crypto';
import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;

const userSchema = new Schema({
  googleId: String,
  name: String,
  username: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  password: String,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'none']
  },
  address: String,
  phone: String,
  email: String,
  avatar: String,
  role: { type: String, required: true, enum: ['Customer', 'Staff', 'Owner'], default: 'Customer' }
}, { collection: 'User' });

userSchema.pre('findOneAndDelete', async function (next) {
  const userId = this.getQuery()._id;

  // Xóa tất cả các Booking của user
  await Booking.deleteMany({ customer: userId });

  // Xóa tất cả BookedService của user
  await BookedService.deleteMany({ customer: userId });

  // Hoặc: Nếu user là nhân viên phụ trách dịch vụ, cũng xóa hoặc xử lý
  await BookedService.updateMany({ inCharge: userId }, { $unset: { inCharge: "" } });

  next();
});
const User = model('User', userSchema);

export default User;
