//serviceState.js
class ServiceState {
    constructor(serviceContext) {
      this.serviceContext = serviceContext;
    }
    confirm(shiftId) {
        throw new Error('Cannot confirm in current state.');
    }
    cancel() {
      throw new Error('Cannot cancel in current state.');
    }
    complete() {
    throw new Error('Cannot complete in current state.');
    }
    review() {
    throw new Error('Cannot review in current state.');
    }
  }
  
export default ServiceState;
  