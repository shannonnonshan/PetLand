//bookingState.js
class BookingState {
    constructor(bookingContext) {
      this.bookingContext = bookingContext;
    }
    paid(accountant) {
      throw new Error('Cannot confirm in current state.');
    }
  }
  
export default BookingState;
  