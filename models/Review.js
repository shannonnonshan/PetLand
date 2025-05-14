import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;
const reviewSchema = new Schema({
    bookedService: {
      type: Schema.Types.ObjectId,
      ref: 'BookedService',
      required: true,
    },
    review:{
        type: String, required:true
    },
    reponse:{
        type: String
    },
    rating:
    {
        type: Number, required:true
    },
    status: { type: Boolean, default:true },
  }, { collection: 'Review', timestamps: true });
  
const Review = model('Review',reviewSchema);
export {Review};