import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;
const bookedServiceSchema = new Schema({
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    shift: { // liên kết với shift mẫu
      type: Schema.Types.ObjectId,
      ref: 'Shift',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled','reviewed'], //confirmed là khách hàng đã confirm giờ đặt
      default: 'pending',
    },
    inCharge: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  }, { collection: "BookedService",timestamps: true });
const bookingSchema = new Schema({
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    bookedServices: [{
      type: Schema.Types.ObjectId,
      ref: 'BookedService',
      required: true,
    }],
    createAt: {
      type: Date,
    },
    paymentAt:{
      type: Date,
    },

    paymentStatus: {
      type: String,
      enum: ['PAID', 'PENDING'],
      default: 'PENDING',
    }
  }, { collection: "Booking", timestamps: true });
const shiftSchema = new Schema({
    bookedService: {
      type: Schema.Types.ObjectId,
      ref: 'BookedService',
      required: true,
    },
    startTime: {
      type: Date, // 'HH:mm'
      required: true,
    },
    endTime: {
      type: Date, // 'HH:mm'
      required: true,
    },
  }, { collection: 'Shift', timestamps: true });
  bookedServiceSchema.methods.setState = function(state) {
    this._state = state;  // Cập nhật trạng thái hiện tại của đối tượng
    this.status = state.status;  // Cập nhật trạng thái trong cơ sở dữ liệu nếu cần thiết
};
  
  bookedServiceSchema.methods.confirm = function () {
    this._state.confirm(); // Gọi phương thức confirm() của trạng thái hiện tại
  };
  
  bookedServiceSchema.methods.complete = function () {
    this._state.complete(); // Gọi phương thức complete() của trạng thái hiện tại
  };

  bookingSchema.methods.setState = function(state) {
    this._state = state;  // Cập nhật trạng thái hiện tại của đối tượng
    this.status = state.status;  // Cập nhật trạng thái trong cơ sở dữ liệu nếu cần thiết
};
  
  bookingSchema.methods.paid = function () {
    this._state.paid(); // Gọi phương thức confirm() của trạng thái hiện tại
  };
  
const Booking = model('Booking', bookingSchema);
const BookedService = model('BookedService',bookedServiceSchema);
const Shift = model('Shift',shiftSchema);
export {Booking, BookedService, Shift};