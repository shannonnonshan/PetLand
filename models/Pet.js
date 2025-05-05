
import { mongoose } from '../utils/db.js'; 
const { Schema, model } = mongoose;



const petSchema = new Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
  specie: {
    type: String,
    enum: ['Dog', 'Cat'],
  },
  age: Number,
  weight: Number,
  breed: String,
  vaccine: {
    type: String,
    enum: ['None', 'Fully'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
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

petSchema.methods.setState = function (state) {
  this._state = state;
};

petSchema.methods.approve = function () {
  this._state?.approve?.();
};

petSchema.methods.adopt = function () {
  this._state?.adopt?.();
};

petSchema.methods.completeAdoption = function () {
  this._state?.completeAdoption?.();
};
petSchema.methods.reject = function () {
  this._state?.reject?.();
};


const Pet = model('Pet', petSchema);

export default Pet;
