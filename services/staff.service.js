import SupportRequest from '../models/SupportRequest.js';

export default {
  findAll() {
    return SupportRequest.find()
      .populate('customerId', 'email') // chỉ lấy field email
      .sort({ createdAt: -1 })
      .lean();
  },

  findByStatus(status) {
    return SupportRequest.find({ status })
      .populate('customerId', 'email')
      .sort({ createdAt: -1 })
      .lean();
  },

  findById(id) {
    return SupportRequest.findById(id)
      .populate('customerId', 'email')
      .lean();
  },

  replyToRequest(id, response) {
    return SupportRequest.findByIdAndUpdate(
      id,
      {
        status: 'responded',
        response: response,
        respondedAt: new Date()
      },
      { new: true }
    );
  },

  countByStatus() {
    return SupportRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  },

  countTotal() {
    return SupportRequest.countDocuments();
  }
};
