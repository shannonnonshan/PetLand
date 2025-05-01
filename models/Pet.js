
import { mongoose } from '../utils/db.js'; 
import PetContext from './petContext.js';
const { Schema, model } = mongoose;



const petSchema = new Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
  specie: String,
  age: Number,
  weight: Number,
  breed: String,
  vaccine: String,
  gender: String,
  images: [String],
  description: String,
  dod: Date,
  status: {
    type: String,
    enum: ['pending', 'approved', 'adopt_requested', 'adopt_approved', 'adopt_completed'],
    default: 'pending'
  },
  donator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adopter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  adoptDate: {
    type: Date,
    default: null
  }
}, { collection: 'Pet' });

petSchema.methods.setState = function(state) {
  this.petContext = state;
};

petSchema.methods.approve = function() {
  this.petContext.approve();
};

petSchema.methods.adopt = function() {
  this.petContext.adopt();
};

petSchema.methods.completeAdoption = function() {
  this.petContext.completeAdoption();
};
const Pet = model('Pet', petSchema);

export default Pet;
