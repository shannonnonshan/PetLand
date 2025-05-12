//pendingBookingState.js
import BookingState from "./bookingState.js";

class PendingBookingState extends BookingState {
  constructor(booking) {
    super(booking);
    this.context = booking;
  }
  paid(accountant) {
    this.context.paymentStatus = 'PAID'; // <- rất quan trọng
    this.context.accountant = accountant;      // Gán shift nếu cần
  }
}

export default PendingBookingState;
