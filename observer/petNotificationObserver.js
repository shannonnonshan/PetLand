import { Observer } from './observer.js';
import {NotificationService} from '../services/notification.service.js';
export class PetNotificationObserver extends Observer {
  async update(data) {
    const { entity, newStatus, triggeredBy, entityType } = data;
    if (entityType !== 'Pet') return;
    const message = `Pet "${entity.name}" status changed to "${newStatus}"`;

    const notification = await NotificationService.notify({
      toUsers: entity.notifyUsers,
      content: message,
      relatedEntity: entity._id,
      entityType: entityType,
      triggeredBy
    });

  }
}