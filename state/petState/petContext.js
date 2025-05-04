import PendingState from './pendingState.js';
import ApprovedState from './approvedState.js';
import RejectedState from './rejectedState.js';
import AdoptApprovedState from './adoptApprovedState.js';
import AdoptRequestedState from './adoptRequestedState.js';
import AdoptCompletedState from './adoptCompletedState.js';

class PetContext {
  constructor(pet) {
    this.pet = pet;

    switch (pet.status) {
      case 'pending':
        this._state = new PendingState(this);
        break;
      case 'approved':
        this._state = new ApprovedState(this);
        break;
      case 'adopt_requested':
        this._state = new AdoptRequestedState(this);
        break;
      case 'adopt_approved':
        this._state = new AdoptApprovedState(this);
        break;
      case 'adopt_completed':
        this._state = new AdoptCompletedState(this);
        break;
      case 'rejected':
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

  reject() {
    this._state.reject?.();
  }
}

export default PetContext;
