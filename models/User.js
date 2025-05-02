import { randomUUID } from 'crypto';
import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;

const userSchema = new Schema({
  googleId: String,
  name: String,
  username: String,
  createdAt: { type: Date, default: Date.now },
  password: String,
  gender: String,
  address: String,
  phone: String,
  email: String,
  avatar: String
}, { collection: 'User' });

const User = model('User', userSchema);

export default User;
