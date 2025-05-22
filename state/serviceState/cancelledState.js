// cancelledState.js
import ServiceState from './serviceState.js';

class CancelledState extends ServiceState {
    cancel() {
        throw new Error('Already cancelled');
      }
}

export default CancelledState;
