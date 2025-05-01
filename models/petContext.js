// models/petContext.js
import PendingState  from '../state/pendingState.js';

class PetContext {
  constructor(pet) {
    this.pet = pet;
    this.state = new PendingState(this);  // Khi tạo pet, mặc định là "pending"
  }

  setState(state) {
    this.state = state;
  }

  approve() {
    this.state.approve();
  }

  adopt() {
    this.state.adopt();
  }

  completeAdoption() {
    this.state.completeAdoption();
  }
}

export default PetContext;
