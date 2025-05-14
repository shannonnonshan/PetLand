import { mongoose } from '../utils/db.js'; 
import User from './User.js'; 

const SupportRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến User
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'responded'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  response: {
    type: String
  },
  respondedAt: {
    type: Date
  }
});

// Tạo một hook middleware để xác thực khi lưu SupportRequest
SupportRequestSchema.pre('save', async function (next) {
  // Kiểm tra xem customerId có tồn tại trong bảng User không
  const user = await User.findById(this.customerId);
  if (!user) {
    const error = new Error('User not found');
    next(error);
  } else {
    next();  // Nếu người dùng tồn tại, tiếp tục lưu
  }
});

export default mongoose.model('SupportRequest', SupportRequestSchema);
