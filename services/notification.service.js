import Notification from '../models/Notification.js';

class NotificationService {
  static async notify({ toUsers, content, relatedEntity, entityType, triggeredBy }) {
    const notify = await Notification.create({
      to: toUsers, // <-- array
      from: triggeredBy,
      content,
      relatedEntity,
      entityType,
      isRead: false,
      createAt: new Date()
    });

    return notify;
  }
}

export  {NotificationService};

export default {
  findNotificationByUserId(id) {
    return Notification.find({ to: id })
      .populate('from', 'to')
      .sort({ updatedAt: -1 }).lean();
  },
  findNotificationByIdAndUpdateStatus(id) {
    return Notification.findByIdAndUpdate(id, { isRead: true });
  },  
  findNotificationById(id) {
    return Notification.findById(id)
      .populate('from', 'to')
      .lean();
  },
}
