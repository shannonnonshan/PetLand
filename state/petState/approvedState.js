// states/approvedState.js
import PetState from './petState.js';
import AdoptRequestedState from './adoptRequestedState.js';

class ApprovedState extends PetState {
  adopt() {
    console.log("Adopting pet...");
    this.petContext.pet.status = 1;
    this.petContext.setState(new AdoptRequestedState(this.petContext));
  }
}

export default ApprovedState;
