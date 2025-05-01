import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://donnade:thanhvyneh@petland.lruap6s.mongodb.net/petland?retryWrites=true&w=majority&appName=Petland')
  .then(() => console.log('Connected!'));

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  serviceName: { type: String, required: true },
  petType: { type: Number, enum: [1, 2, 3], required: true }, // 1: Dog, 2: Cat, 3: Both
  description: { type: String }, // HTML-format string
  shortDescription: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  imageUrl: { type: String }
}, { collection: 'Service' });


const Service = mongoose.model('Service', serviceSchema);

export { Service};
