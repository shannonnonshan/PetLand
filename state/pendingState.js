
import PetState from './petState.js';

class PendingState extends PetState {
  approve() {
    console.log("Approving pet...");
    this.petContext.setState(new ApprovedState(this.petContext));
  }
}

export default PendingState;
