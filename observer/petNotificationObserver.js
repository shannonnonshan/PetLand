// observers/petNotificationObserver.js
import { STATUS } from '../constants/petStatus.js';
import { Observer } from './observer.js';
import userService from '../services/user.service.js';
import { NotificationService } from '../services/notification.service.js';
import moment from 'moment';

export class PetNotificationObserver extends Observer {
  async update(data) {
    const { entity, newStatus, triggeredBy, entityType } = data;

    if (entityType !== 'Pet') return;

    console.log('[PetObserver] Status:', newStatus);

    try {
      // Notify system owners when there is a new request
      if ([STATUS.REQUEST_DONATION, STATUS.REQUEST_ADOPTION].includes(newStatus)) {
        const owners = await userService.getOwners();
        if (!owners?.length) {
          console.warn('[PetObserver] No owners found');
          return;
        }

        const isDonate = newStatus === STATUS.REQUEST_DONATION;
        const message = `There is a new ${isDonate ? 'donation' : 'adoption'} request for pet "${entity.name}" at ${moment().format('DD/MM/YYYY HH:mm')}`;

        await NotificationService.notify({
          toUsers: owners,
          content: message,
          relatedEntity: entity._id,
          entityType,
          triggeredBy
        });

        console.log('[PetObserver] Notification sent to owners');
      }

      // Notify adopter when adoption is approved
      else if (newStatus === STATUS.APPROVAL_ADOPTION) {
        if (!entity.adopter) return;

        const message = `Your adoption request for pet "${entity.name}" has been approved at ${moment().format('DD/MM/YYYY HH:mm')}`;

        await NotificationService.notify({
          toUsers: [entity.adopter],
          content: message,
          relatedEntity: entity._id,
          entityType,
          triggeredBy
        });

        console.log('[PetObserver] Notification sent to adopter');
      }

      // Notify donator when donation is approved
      else if (newStatus === STATUS.APPROVAL_DONATION) {
        if (!entity.donator) return;

        const message = `Your pet donation request for "${entity.name}" has been approved at ${moment().format('DD/MM/YYYY HH:mm')}`;

        await NotificationService.notify({
          toUsers: [entity.donator],
          content: message,
          relatedEntity: entity._id,
          entityType,
          triggeredBy
        });

        console.log('[PetObserver] Notification sent to donator');
      }

      // Notify rejection to adopter or donator
      else if (newStatus === STATUS.REJECTED) {
        var user;
        if(entity.adopter)
        {
          user = entity.adopter;
        }
        else{
          user = entity.donator;
        }
        if (!user) return;

        const type = newStatus === STATUS.REJECTED? 'adoption' : 'donation';
        const message = `Your ${type} request for pet "${entity.name}" has been rejected at ${moment().format('DD/MM/YYYY HH:mm')}`;

        await NotificationService.notify({
          toUsers: user._id,
          content: message,
          relatedEntity: entity._id,
          entityType,
          triggeredBy
        });

        console.log(`[PetObserver] Notification sent to ${type === 'adoption' ? 'adopter' : 'donator'}`);
      }

    } catch (error) {
      console.error('[PetObserver] Notification error:', error);
    }
  }
}
