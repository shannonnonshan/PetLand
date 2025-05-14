import mongoose from 'mongoose';

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

export default mongoose.model('SupportRequest', SupportRequestSchema);