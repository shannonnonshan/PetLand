
import SupportRequest from '../models/SupportRequest.js';
export default {
    findAllFeedBack() {
    return SupportRequest.find()
      .populate('customerId', 'email name')
      .sort({ createdAt: -1 })
      .lean();
  },

  findFeedBackByStatus(status) {
    return SupportRequest.find({ status })
      .populate('customerId', 'email name')
      .sort({ createdAt: -1 })
      .lean();
  },

  findFeedBackById(id) {
    return SupportRequest.findById(id)
      .populate('customerId', 'email name')
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

  countFeedBackByStatus() {
    return SupportRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  },

  countTotalFeedBack() {
    return SupportRequest.countDocuments();
  }
};
