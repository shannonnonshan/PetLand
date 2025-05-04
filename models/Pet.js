
import { mongoose } from '../utils/db.js'; 
import PetContext from '../state/petState/petContext.js';
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
    enum: ['pending', 'approved', 'adopt_requested', 'adopt_approved', 'adopt_completed', 'rejected'],
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

// Chỗ này gán đúng thuộc tính
petSchema.methods.setState = function (state) {
  this._state = state;
};

// Gọi method state đúng context
petSchema.methods.approve = function () {
  this._state?.approve?.();
};

petSchema.methods.adopt = function () {
  this._state?.adopt?.();
};

petSchema.methods.completeAdoption = function () {
  this._state?.completeAdoption?.();
};

const Pet = model('Pet', petSchema);

export default Pet;
