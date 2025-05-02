// states/adoptApprovedState.js
import PetState from './petState.js';
import AdoptCompletedState from './adoptCompletedState.js';

class AdoptApprovedState extends PetState {
  completeAdoption() {
    console.log("Completing adoption...");

    // Cập nhật trạng thái trong DB
    this.petContext.pet.status = 'adopt_completed';

    // Cập nhật trạng thái trong context
    this.petContext.setState(new AdoptCompletedState(this.petContext));
  }
}

export default AdoptApprovedState;
