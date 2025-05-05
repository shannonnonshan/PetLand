import BookingState from "./bookingState.js";

class PendingBookingState extends BookingState {
  constructor(booking) {
    super(booking);
    this.context = booking;
  }
  paid() {
    this.context.status = 'PAID'; // <- rất quan trọng
  }
}

export default PendingBookingState;
