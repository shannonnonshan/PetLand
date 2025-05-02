// state/pendingState.js
import PetState from './petState.js';
import ApprovedState from './approvedState.js';
import RejectedState from './rejectedState.js';

class PendingState extends PetState {
  constructor(context) {
    super();
    this.petContext = context;
  }

  async approve() {
    console.log("Approving pet...");
    this.petContext.pet.status = 'approved';
    await this.petContext.pet.save();
    this.petContext.setState(new ApprovedState(this.petContext));
  }

  async reject() {
    console.log("Rejecting pet...");
    this.petContext.pet.status = 'rejected';
    await this.petContext.pet.save();
    this.petContext.setState(new RejectedState(this.petContext));
  }
}

export default PendingState;
