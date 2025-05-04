// states/adoptRequestedState.js
import PetState from './petState.js';
import AdoptApprovedState from './adoptApprovedState.js';
import RejectedState from './rejectedState.js';

class AdoptRequestedState extends PetState {
  constructor(context) {
    super();
    this.petContext = context;
  }

  async adopt() {
    console.log("Approving pet...");
    this.petContext.pet.status = 'adopt_approved';
    this.petContext.setState(new AdoptApprovedState(this.petContext));
  }
  async rejectAdoption() {
    console.log("Rejecting pet...");
    this.petContext.pet.status = 'rejected';
    this.petContext.setState(new RejectedState(this.petContext));
  }
}
export default AdoptRequestedState;
