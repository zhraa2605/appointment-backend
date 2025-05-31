const RescheduleRequest = require('../models/reschedulRequestsModel');
const Appointment = require('../models/AppointmentsModel');

exports.createRescheduleRequest = async (req, res) => {
  try {
    const { appointment_id, new_date, new_time } = req.body;
    // Check if an existing reschedule already exists for that appointment
    const existing = await RescheduleRequest.findOne({ appointment_id });
    if (existing) {
      return res.status(400).json({ message: 'Reschedule request already exists for this appointment' });
    }

    const request = await RescheduleRequest.create({ appointment_id, new_time , new_date });

    res.status(201).json(request);
  } catch (err) {
    console.error('Create Reschedule Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 📄 Get all reschedule requests (optionally filter by status or appointment_id)
exports.getRescheduleRequests = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.appointment_id) {
      filter.appointment_id = req.query.appointment_id;
    }

    const requests = await RescheduleRequest.find(filter).populate('appointment_id');

    res.status(200).json(requests);
  } catch (err) {
    console.error('Fetch Reschedules Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Accept or Deny a reschedule request
exports.respondToRescheduleRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'denied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await RescheduleRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: 'Reschedule request not found' });
    }

    // If accepted, update the appointment's time
    if (status === 'accepted') {
      await Appointment.findByIdAndUpdate(request.appointment_id, {
        time: request.new_time,
        date: request.new_date
      });
    }
    const appointment = await Appointment.findById(request.appointment_id);
    await sendNotification({
      user_id: appointment.Patient,
      message: `Your appointment has been rescheduled to ${request.new_date} at ${request.new_time}.`,
    });

    res.status(200).json(request);
  } catch (err) {
    console.error('Respond to Reschedule Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ❌ Delete a reschedule request (e.g., cleanup or cancellation)
exports.deleteRescheduleRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await RescheduleRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Reschedule request not found' });
    }

    res.status(200).json({ message: 'Reschedule request deleted' });
  } catch (err) {
    console.error('Delete Reschedule Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

