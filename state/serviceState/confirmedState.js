import ServiceState from './serviceState.js';

class ConfirmedState extends ServiceState {
    constructor(bookedService) {
        super(bookedService);
        this.context = bookedService;
      }
    
      confirm(shiftId) {
        throw new Error('Already confirmed');
      }
    
      complete() {
        this.context.status = 'completed'; // <- rất quan trọng
      }
}

export default ConfirmedState;
