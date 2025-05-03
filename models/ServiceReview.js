import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://donnade:thanhvyneh@petland.lruap6s.mongodb.net/petland?retryWrites=true&w=majority&appName=Petland')
  .then(() => console.log('Connected!'));

const Schema = mongoose.Schema; 
const reviewSchema = new mongoose.Schema({
rate: { type: Number, required: true },
content: { type: String, required: true },
customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
booking: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
createdAt: { type: Date, default: Date.now },
status: { type: Boolean, default: true }
});

const responseReviewSchema = new mongoose.Schema({
review: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
content: { type: String, required: true },
customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
createdAt: { type: Date, default: Date.now }
});
  
const Review = mongoose.model('Review', reviewSchema);
const ResponseReview = mongoose.model('ResponseReview', responseReviewSchema);
export { Review,ResponseReview};
