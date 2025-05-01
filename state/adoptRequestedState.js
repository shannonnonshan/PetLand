// states/adoptRequestedState.js
const PetState = require('./petState.js');
const AdoptApprovedState = require('./adoptApprovedState.js');

class AdoptRequestedState extends PetState {
  adopt() {
    console.log("Adopt requested pet...");
    this.petContext.setState(new AdoptApprovedState(this.petContext));
  }
}

module.exports = AdoptRequestedState;
