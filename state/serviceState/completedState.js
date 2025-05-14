// completedState.js
import ServiceState from './serviceState.js';

class CompletedState extends ServiceState {
    constructor(bookedService) {
        super(bookedService);
        this.context = bookedService;
      }
    
      review() {
        this.context.status = 'reviewed'; // <- rất quan trọng
      }
}

export default CompletedState;
