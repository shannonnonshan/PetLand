import { BookingNotificationObserver } from '../observer/bookingNotificationObserver.js';
import { PetNotificationObserver } from '../observer/petNotificationObserver.js';
import { Notifier } from './notifiers.js';
import { MaintenanceNotificationObserver } from '../observer/maintenanceNotificationObserver.js'; 

const notifier = new Notifier();
notifier.subscribe(new BookingNotificationObserver());
notifier.subscribe(new PetNotificationObserver());
notifier.subscribe(new MaintenanceNotificationObserver());

export default notifier;