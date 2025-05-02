// states/adoptRequestedState.js
import PetState from './petState.js';
import AdoptApprovedState from './adoptApprovedState.js';

class AdoptRequestedState extends PetState {
  adopt() {
    console.log("Adopt requested pet...");
    this.petContext.pet.status = 'adopt_approved'; 
    this.petContext.setState(new AdoptApprovedState(this.petContext));
  }
}

export default AdoptRequestedState;
