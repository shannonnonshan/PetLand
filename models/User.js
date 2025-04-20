// models/User.js
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://donnade:thanhvyneh@petland.lruap6s.mongodb.net/petland?retryWrites=true&w=majority&appName=Petland')
.then(() => console.log('Connected!'));

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  username: String,
  createAt: { type: Date, default: Date.now },
  password: String,
  gender: String,
  address: String,
  phone: String,
  email: String,
  avatar: String
},
  { collection: 'User' }
);

const User = mongoose.model('User', userSchema);

export default User;
