import BookingState from "./bookingState.js";

class PendingBookingState extends BookingState {
    constructor(context) {
        super();
        this.serviceContext = context;
      }
}

export default PendingBookingState;
