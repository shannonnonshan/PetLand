import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://donnade:thanhvyneh@petland.lruap6s.mongodb.net/petland?retryWrites=true&w=majority&appName=Petland')
  .then(() => console.log('Review Connected!'));
const reviewSchema = new mongoose.Schema({
    bookedService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookedService',
      required: true,
    },
    reponse:{
        type: String, require:true
    },
    rating:
    {
        type: Number, require:true
    },
    status: {
        type: String,
        enum: ['show', 'hide'], //confirmed là khách hàng đã confirm giờ đặt
        default: 'show',
      },
  }, { collection: 'Review', timestamps: true });
  
const Shift = mongoose.model('Review',shiftSchema);
export {reviewSchema};