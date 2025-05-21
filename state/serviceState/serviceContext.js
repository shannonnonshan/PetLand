//serviceContext.js
import PendingState from "./pendingState.js";
import CompletedState from "./completedState.js";
import ConfirmedState from "./confirmedState.js";
import CancelledState from "./cancelledState.js";
import ReviewedState from "./reviewedState.js";
class ServiceContext {
  constructor(bookedService) {
    this.bookedService = bookedService;
    console.log(this.bookedService.status);
    switch (bookedService.status) {
      case 'pending':
        this._state = new PendingState(this.bookedService);
        break;
      case 'completed':
        this._state = new CompletedState(this.bookedService);
        break;
      case 'confirmed':
        this._state = new ConfirmedState(this.bookedService);
        break;
      case 'cancelled':
        this._state = new CancelledState(this.bookedService);
        break;
      case 'reviewed':
        this._state = new ReviewedState(this.bookedService);
        break;
      default:
        throw new Error('Unknown status');
    }
  }

  setState(state) {
    this._state = state;
  }

  confirm(shiftId) {
    this._state.confirm(shiftId);  // Confirm trạng thái nếu thuộc PendingState hoặc ConfirmedState
  }

  complete() {
    this._state.complete();  // Hoàn thành nếu thuộc trạng thái Pending hoặc Confirmed
  }
  cancel() {
    this._state.cancel();
  }
  review()
  {
    this._state.review?.();
  }
  async save() {
    return this.bookedService.save();  // Mongoose save()
  }
}

export default ServiceContext;
