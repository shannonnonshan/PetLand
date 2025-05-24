//bookingState.js
class BookingState {
    constructor(booking) {
      this.booking = booking;
    }
    paid(accountant) {
      throw new Error('Cannot confirm in current state.');
    }
  }
  
export default BookingState;
  