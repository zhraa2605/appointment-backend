const mongoose = require('mongoose');
const { Schema } = mongoose;

const rescheduleRequestSchema = new Schema(
  {
    appointment_id: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true, 
    },
    new_date: {
      type: String,
      required: true,
    },
    
    new_time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting_user', 'accepted', 'denied'],
      default: 'waiting_user',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

module.exports = mongoose.model('RescheduleRequest', rescheduleRequestSchema);
