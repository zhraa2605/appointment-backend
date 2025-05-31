const mongoose = require('mongoose');
const { Schema } = mongoose;

const doctorAvailabilitySchema = new Schema(
  {
    doctor_id: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    day_of_week: {
      type: Number,
      min: 0,
      max: 6, // 0 = Sunday
      required: true,
    },
    start_time: {
      type: String, // Format: "HH:MM"
      required: true,
    },
    end_time: {
      type: String, // Format: "HH:MM"
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

module.exports = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
