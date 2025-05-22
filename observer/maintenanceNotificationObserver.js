import { Observer } from './observer.js';
import { NotificationService } from '../services/notification.service.js';
import moment from 'moment';
import userService from '../services/user.service.js';

export class MaintenanceNotificationObserver extends Observer {
  async update(data) {
    const { entityType, message, triggeredBy } = data;

    if (entityType !== 'Maintenance') return;

    const recipients = await userService.getAllUsersAndStaff(); 

    if (!recipients.length) return;

    await NotificationService.notify({
      toUsers: recipients,
      content: message,
      entityType,
      triggeredBy
    });
  }
}
