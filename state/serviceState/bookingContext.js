//bookingContext.js
import PaidState from "./paidState.js";
import PendingBookingState from "./pendingBookingState.js";
class BookingContext {
  constructor(booking) {
    this.booking = booking;
    console.log(this.booking.paymentStatus);

    switch (booking.paymentStatus) {
      case 'PAID':
        this._state = new PaidState(this.booking);
        break;
      case 'PENDING':
        this._state = new PendingBookingState(this.booking);
        break;
      default:
        throw new Error('Unknown  status');
    }
  }
  setState(state) {
    this._state = state;
  }

  paid(accountant) {
    this._state.paid(accountant);  
  }

  async save() {
    return this.booking.save();  // Mongoose save()
  }
}

export default BookingContext;
