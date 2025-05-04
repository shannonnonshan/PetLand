import BookingState from "./bookingStat.js";

class PaidState extends BookingState {
  constructor(context) {
    super();
    this.serviceContext = context;
  }
}

export default PaidState;
