const {
    getAllDoctorAvailability,
    getDoctorAvailabilityById,
    createDoctorAvailability,
    updateDoctorAvailability,
    deleteDoctorAvailability,
    getDoctorAvailabilityByDoctorId,
    getDoctorAvailabilityByDate
} = require('../controllers/DoctorAvailabilitycontrollers');
const { Auth ,requireRole } = require('../middleware/Auth');
const express = require('express');
const DoctorAvailabilityRouter = express.Router();
// Get all DoctorAvailability
DoctorAvailabilityRouter.get('/',Auth, getAllDoctorAvailability);
// Get DoctorAvailability by id
DoctorAvailabilityRouter.get('/:id', Auth, getDoctorAvailabilityById);
// Create DoctorAvailability
DoctorAvailabilityRouter.post('/', Auth, createDoctorAvailability);
// Update DoctorAvailability
DoctorAvailabilityRouter.put('/:id', Auth, updateDoctorAvailability);
// Delete DoctorAvailability
DoctorAvailabilityRouter.delete('/:id', Auth, deleteDoctorAvailability);
// Get DoctorAvailability by doctor id
DoctorAvailabilityRouter.get('/doctor/:id', Auth, getDoctorAvailabilityByDoctorId);
// Get DoctorAvailability by date
DoctorAvailabilityRouter.get('/date/:date', Auth, getDoctorAvailabilityByDate);
