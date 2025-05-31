const { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/DoctorControllers');

const express = require('express');
const DoctorRouter = express.Router();
const { Auth ,requireRole } = require('..//middleware/Auth');


DoctorRouter.get('/',Auth, getAllDoctors);
DoctorRouter.get('/:id', Auth, getDoctorById);
DoctorRouter.post('/', Auth, requireRole('admin'), createDoctor);
DoctorRouter.put('/:id', Auth, updateDoctor);
DoctorRouter.delete('/:id', Auth, requireRole('admin'), deleteDoctor);

module.exports = DoctorRouter;

