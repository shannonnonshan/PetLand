import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://donnade:thanhvyneh@petland.lruap6s.mongodb.net/petland?retryWrites=true&w=majority&appName=Petland')
  .then(() => console.log('Review Connected!'));
const reviewSchema = new mongoose.Schema({
    bookedService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookedService',
      required: true,
    },
    review:{
        type: String, required:true
    },
    reponse:{
        type: String, required:true
    },
    rating:
    {
        type: Number, required:true
    },
    status: {
        type: Boolean,
        required:true
    },
  }, { collection: 'Review', timestamps: true });
  
const Review = mongoose.model('Review',reviewSchema);
export {Review};