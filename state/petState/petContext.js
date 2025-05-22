import RequestDonationState from './pendingState.js';
import ApprovedDonationState from './approvedState.js';
import RejectedState from './rejectedState.js';
import AdoptApprovedState from './adoptApprovedState.js';
import AdoptRequestedState from './adoptRequestedState.js';
import AdoptCompletedState from './adoptCompletedState.js';

class PetContext {
  constructor(pet) {
    this.pet = pet;

    switch (pet.status) {
      case 1:
        this._state = new RequestDonationState(this);
        break;
      case 2:
        this._state = new ApprovedDonationState(this);
        break;
      case 3:
        this._state = new AdoptRequestedState(this);
        break;
      case 4:
        this._state = new AdoptApprovedState(this);
        break;
      case 5:
        this._state = new AdoptCompletedState(this);
        break;
      case 6:
        this._state = new RejectedState(this);
        break;
      default:
        throw new Error('Unknown pet status');
    }
  }

  setState(state) {
    this._state = state;
  }

  approve() {
    this._state.approve();
  }

  adopt() {
    this._state.adopt();
  }

  completeAdoption() {
    this._state.completeAdoption();
  }

  rejectDonation() {
    this._state.rejectDonation?.();
  }
  rejectAdoption() {
    this._state.rejectAdoption?.();
  }

}

export default PetContext;
