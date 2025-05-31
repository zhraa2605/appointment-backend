const cron = require('node-cron');
const Appointment = require('../models/AppointmentsModel');
const mongoose = require('mongoose');
const sendNotification = require('../utils/sendNotification');

// Every minute
cron.schedule('* * * * *', async () => {
  console.log(' Running duplicate appointment check...');

  try {
    const appointments = await Appointment.find();

    const seen = {};

    for (const appt of appointments) {
      const key = `${appt.doctor}_${appt.date}_${appt.time}`;

      if (seen[key]) {
        // Cancel the newer one
        await Appointment.findByIdAndUpdate(appt._id, {
          status: 'cancelled',
          cancel_reason: 'Duplicate appointment detected by system',
        });

        console.log(` Cancelled duplicate: ${appt._id}`);
      } else {
        seen[key] = appt._id;
      }
    }

    console.log('✅ Duplicate scan finished');
  } catch (err) {
    console.error('Cron job error:', err);
  }
});


cron.schedule('0 8 * * *', async () => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const appointments = await Appointment.find({ date: today, status: { $in: ['confirmed'] } });
  for (const appt of appointments) {
    await sendNotification({
      user_id: appt.Patient,
      message: `Reminder: You have an appointment today at ${appt.time}.`,
    });
  }
});