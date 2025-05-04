class ServiceState {
    constructor(bookedService) {
      this.bookedService = bookedService;
    }
    confirm(shiftId) {
        throw new Error('Cannot confirm in current state.');
      }
    
    complete() {
    throw new Error('Cannot complete in current state.');
    }
    
  }
  
export default ServiceState;
  