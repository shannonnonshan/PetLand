// states/adoptApprovedState.js
const PetState = require('./petState.js');
const AdoptCompletedState = require('./adoptCompletedState.js');

class AdoptApprovedState extends PetState {
  completeAdoption() {
    console.log("Completing adoption...");
    this.petContext.setState(new AdoptCompletedState(this.petContext));
  }
}

module.exports = AdoptApprovedState;
