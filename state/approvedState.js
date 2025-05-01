// states/approvedState.js
const PetState = require('./petState.js');
const AdoptRequestedState = require('./adoptRequestedState.js');

class ApprovedState extends PetState {
  adopt() {
    console.log("Adopting pet...");
    this.petContext.setState(new AdoptRequestedState(this.petContext));
  }
}

module.exports = ApprovedState;
