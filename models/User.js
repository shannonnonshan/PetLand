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
    enum: ['Male', 'Female', 'none'],
    default: 'none'
  },
  address: String,
  phone: String,
  email: String,
  avatar: String,
  role: { type: String, required: true, enum: ['Customer', 'Staff', 'Owner'], default: 'Customer' }
}, { collection: 'User' });

const User = model('User', userSchema);

export default User;
