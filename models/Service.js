import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;
const serviceSchema = new Schema({
  id: { type: String, required: true },
  serviceName: { type: String, required: true },
  petType: { type: Number, enum: [1, 2, 3], required: true }, // 1: Dog, 2: Cat, 3: Both
  description: { type: String }, // HTML-format string
  shortDescription: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  imageUrl: { type: String },
  hidden: { type: Boolean },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
}, { collection: 'Service' });


const Service = model('Service', serviceSchema);

export { Service};
