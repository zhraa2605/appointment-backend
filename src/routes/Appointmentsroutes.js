// In your routes file (AppointmentsRouter.js)
const { createAppointment, deleteAppointment, getAllAppointments, getAppointmentById, getUserAppointments, getDoctorAppointments, getAppointmentByStatus, updateAppointment , deleteAllAppointments } = require('../controllers/AppointmentsControllers');
const { Auth } = require('../middleware/Auth');  // Ensure proper import

const express = require('express');
const AppointmentRouter = express.Router();

// Define your routes and use the Auth middleware where necessary
AppointmentRouter.post('/', Auth, createAppointment);  // Create a new appointment
AppointmentRouter.delete('/:id', Auth, deleteAppointment);  // Delete an appointment by id
AppointmentRouter.get('/', Auth, getAllAppointments);  // Get all appointments
AppointmentRouter.get('/:id', Auth, getAppointmentById);  // Get an appointment by id
AppointmentRouter.get('/user/:userId', getUserAppointments);  // Get appointments for a specific user
AppointmentRouter.get('/doctor/:doctorId', Auth, getDoctorAppointments);  // Get appointments for a specific doctor
AppointmentRouter.get('/status/:status', Auth, getAppointmentByStatus);  // Get appointments by status
AppointmentRouter.put('/:id', Auth, updateAppointment);  // Update an appointment by id
AppointmentRouter.delete('/', Auth, deleteAllAppointments);  // Delete all appointments



module.exports = AppointmentRouter;
