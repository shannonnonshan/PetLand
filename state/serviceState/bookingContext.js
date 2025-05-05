import PaidState from "./paidState.js";
import PendingBookingState from "./pendingBookingState.js";
class BookingContext {
  constructor(pet) {
    this.booking = booking;
    console.log(this.bookedService.status);

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
  setState(state) {
    this._state = state;
  }

  paid() {
    this._state.confirm();  
  }

  async save() {
    return this.bookedService.save();  // Mongoose save()
  }
}

export default BookingContext;
