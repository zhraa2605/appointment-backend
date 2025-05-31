const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    Patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    date: {
      type: String, 
      required: true,
    },
    time: {
      type: String, 
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    cancel_reason: {
      type: String,
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Validation to ensure cancel_reason is set when status is cancelled
appointmentSchema.pre('save', function (next) {
  if (this.status === 'cancelled' && !this.cancel_reason) {
    return next(new Error('Cancel reason is required when status is cancelled.'));
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
