class BookingState {
    constructor(bookingContext) {
      this.bookingContext = bookingContext;
    }
    paid() {
      throw new Error('Cannot confirm in current state.');
    }
  }
  
export default BookingState;
  