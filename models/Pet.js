import { randomUUID } from 'crypto';
import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;

const petSchema = new Schema({
  id: { type: String, default: () => randomUUID() },
  name: String,
  createdAt: { type: Date, default: Date.now },
  specie: String,
  breed: String,
  vaccine: String,
  gender: String,
  images: [String],
  description: String,
  dod: String
}, { collection: 'Pet' });

const Pet = model('Pet', petSchema);

export default Pet;
