import { randomUUID } from 'crypto';
import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;

const otpSchema = new Schema({
    id: { type: String, default: () => randomUUID() },
    email: String,
    otp: Number,
    expire_time: {
      type: Date,
      required: true,
      index: { expires: 0 } 
    }
  }, { collection: 'OtpUser' });

  const OtpUser = model('OtpUser', otpSchema);
  export default OtpUser;