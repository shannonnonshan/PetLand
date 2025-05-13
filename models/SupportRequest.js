import { mongoose } from '../utils/db.js'; 
import User from './User.js'; // Import model User để đảm bảo liên kết chính xác

const SupportRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Liên kết với model User
    required: true
  },
  customerEmail: {
    type: String,
    required: true // Đảm bảo email luôn có
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
