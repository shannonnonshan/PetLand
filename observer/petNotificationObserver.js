import { Observer } from './observer.js';
import { NotificationService } from '../services/notification.service.js';
import moment from 'moment';

export class PetNotificationObserver extends Observer {
  async update(data) {
    const { entity, newStatus, triggeredBy, entityType } = data;
    if (entityType !== 'Pet') return;

    // Nếu là request thì thông báo cho Owner
    if (['request_donate', 'request_adopt'].includes(newStatus)) {
      if (!entity.owner) return;

      const message = `Your pet "${entity.name}" has a new ${newStatus === 'request_donate' ? 'donation' : 'adoption'} request at ${moment().format('DD/MM/YYYY HH:mm')}`;

      await NotificationService.notify({
        toUsers: [entity.owner],
        content: message,
        relatedEntity: entity._id,
        entityType,
        triggeredBy
      });

    // Nếu là approved thì thông báo cho Customer
    } else if (newStatus === 'approved') {
      if (!entity.customer) return;

      const message = `Your request for the pet "${entity.name}" has been approved at ${moment().format('DD/MM/YYYY HH:mm')}`;

      await NotificationService.notify({
        toUsers: [entity.customer],
        content: message,
        relatedEntity: entity._id,
        entityType,
        triggeredBy
      });
    }
  }
}
