import { randomUUID } from 'crypto';
import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;

const userSchema = new Schema({
  googleId: String,
  id: { type: String, default: () => randomUUID() },
  name: String,
  username: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  password: String,
  gender: String,
  address: String,
  phone: String,
  email: String,
  avatar: String,
  role: { type: String, required: true, enum: ['Customer', 'Staff', 'Owner'] }
}, { collection: 'User' });

const User = model('User', userSchema);

export default User;
