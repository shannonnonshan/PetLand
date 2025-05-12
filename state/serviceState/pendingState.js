
//pendingState.js
import ServiceState from './serviceState.js';

class PendingState extends ServiceState {
  
  constructor(bookedService) {
    super(bookedService);
    this.context = bookedService;
  }

  confirm(shiftId) {
    this.context.status = 'confirmed'; // <- Dòng này rất quan trọng
    this.context.shift = shiftId;      // Gán shift nếu cần
  }

  complete() {
    throw new Error('Cannot complete in pending state');
  }
}

export default PendingState;
