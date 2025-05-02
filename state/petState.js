// states/petState.js
class PetState {
    constructor(petContext) {
      this.petContext = petContext;
    }
  
    approve() {
      throw new Error("Invalid transition");
    }
  
    adopt() {
      throw new Error("Invalid transition");
    }
  
    completeAdoption() {
      throw new Error("Invalid transition");
    }
  }
  
export default PetState;
  