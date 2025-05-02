// state/rejectedState.js
import PetState from './petState.js';

class RejectedState extends PetState {
  constructor(context) {
    super();
    this.petContext = context;
  }

  async reject() {
    console.log("Already rejected.");
  }
}

export default RejectedState;
