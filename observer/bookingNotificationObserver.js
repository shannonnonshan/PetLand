import { Observer } from './observer.js';
import {NotificationService} from '../services/notification.service.js';
import moment from 'moment';
export class BookingNotificationObserver extends Observer {
  async update(data) {
    const { entity, newStatus, triggeredBy, entityType, content } = data;
    if (data.entityType !== 'BookedService') return;
    if (!entity.notifyUsers || entity.notifyUsers.length === 0) return;

    const baseMessage = entity.name
      ? `Booking for ${entity.name} at ${moment(entity.date).format('DD/MM/YYYY HH:mm')} changed to "${newStatus}"`
      : `Booking updated to "${newStatus}".`;
    const message = content ? `${baseMessage} ${content}` : baseMessage;
    // Save to DB
    const notification = await NotificationService.notify({
      toUsers: [
        ...(entity.notifyUsers || []),
        ...(entity.inCharge ? [entity.inCharge] : [])
      ],
      content: message,
      relatedEntity: entity._id,
      entityType: entityType,
      triggeredBy
    });

  }
}
