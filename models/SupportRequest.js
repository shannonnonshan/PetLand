import mongoose from 'mongoose';

const SupportRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // liên kết với bảng User
    required: true
  },
  customerEmail: {
    type: String,
    required: true // đảm bảo email luôn có
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

export default mongoose.model('SupportRequest', SupportRequestSchema);