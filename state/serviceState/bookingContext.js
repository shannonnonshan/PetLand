import PaidState from "./paidState.js";
import PendingBookingState from "./pendingBookingState.js";
class BookingContext {
  constructor(pet) {
    this.pet = pet;

    switch (pet.status) {
      case 'PAID':
        this._state = new PaidState(this);
        break;
      case 'PENDING':
        this._state = new PendingBookingState(this);
        break;
      default:
        throw new Error('Unknown  status');
    }
  }

}

export default BookingContext;
