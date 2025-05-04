import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://donnade:thanhvyneh@petland.lruap6s.mongodb.net/petland?retryWrites=true&w=majority&appName=Petland')
  .then(() => console.log('Connected!'));
const Schema = mongoose.Schema; 
const bookedServiceSchema = new mongoose.Schema({
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
      enum: ['pending', 'confirmed', 'completed'], //confirmed là khách hàng đã confirm giờ đặt
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
  }, { collection: "BookedService" });
const bookingSchema = new mongoose.Schema({
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
    paymentStatus: {
      type: String,
      enum: ['COMPLETED', 'PENDING'],
      default: 'PENDING',
    }
  }, { collection: "Booking" });
const shiftSchema = new mongoose.Schema({
    bookedService: {
      type: mongoose.Schema.Types.ObjectId,
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
  }, { collection: 'Shift' });
  
const Booking = mongoose.model('Booking', bookingSchema);
const BookedService = mongoose.model('BookedService',bookedServiceSchema);
const Shift = mongoose.model('Shift',shiftSchema);
export {Booking, BookedService, Shift};