// states/adoptCompletedState.js
const PetState = require('./petState.js');

class AdoptCompletedState extends PetState {
  // Pet đã hoàn thành việc nhận nuôi, không thể thay đổi trạng thái nữa
}

module.exports = AdoptCompletedState;
