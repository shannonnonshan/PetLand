import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;
const notificationSchema = new Schema({
  to: [{ type: Schema.Types.ObjectId,ref:'User' }],
  content: { type: String, required: true },
  relatedEntity: { type: Schema.Types.ObjectId, ref: 'entityType' },
  entityType: { type: String, enum: ['BookedService', 'Pet','Maintenance'], required: true },
  isRead: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  from: { type: Schema.Types.ObjectId, ref: 'User' },
}, { collection: 'Notification', timestamps: true });
    

const Notification = model('Notification', notificationSchema);

export { Notification};
