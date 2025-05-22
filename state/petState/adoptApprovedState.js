// states/adoptApprovedState.js
import PetState from './petState.js';
import AdoptCompletedState from './adoptCompletedState.js';

class AdoptApprovedState extends PetState {
  completeAdoption() {
    console.log("Completing adoption...");

    this.petContext.pet.status = 5;
    this.petContext.setState(new AdoptCompletedState(this.petContext));
  }
}

export default AdoptApprovedState;
