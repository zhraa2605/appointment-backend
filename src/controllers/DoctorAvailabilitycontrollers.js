const DoctorAvailability = require('../models/DoctorAvailabilityModel');
const Doctor = require('../models/DoctorModel');
const Appointment = require('../models/AppointmentsModel');
const User = require('../models/UsersModel');

const filterAndPaginate = require('../utils/filterAndPaginate');

const getAllDoctorAvailability = async (req, res) => {
    try {
        const doctorAvailability = await DoctorAvailability.find().populate('doctor').populate('days').populate('user')
        
        res.status(200).json(doctorAvailability);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching doctor availability' });
        }
}

const getDoctorAvailabilityById = async (req, res) => {
    try {
        const doctorAvailabilityId = req.params.id;
        const doctorAvailability = await DoctorAvailability.findById(doctorAvailabilityId).populate('doctor').populate('days').populate('time_slots');
        if (!doctorAvailability) {
            return res.status(404).json({ message: 'Doctor availability not found' });
        }
        res.status(200).json(doctorAvailability);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching doctor availability' });
    }
}

const createDoctorAvailability = async (req, res) => {
    try {
        const doctorAvailability = new DoctorAvailability(req.body);
        await doctorAvailability.save();
        res.status(201).json(doctorAvailability);
        }
        catch (error) {
            res.status(500).json({ message: 'Error creating doctor availability' });
        }


const updateDoctorAvailability = async (req, res) => {
    try {
        const doctorAvailabilityId = req.params.id;
        const doctorAvailability = await DoctorAvailability.findByIdAndUpdate(doctorAvailabilityId, req.body, { new:
            true });
        if (!doctorAvailability) {
            return res.status(404).json({ message: 'Doctor availability not found' });
        }
        res.status(200).json(doctorAvailability);
        }
        catch (error) {
            res.status(500).json({ message: 'Error updating doctor availability' });
        }
    }
        
const deleteDoctorAvailability = async (req, res) => {
    try {
        const doctorAvailabilityId = req.params.id;
        const doctorAvailability = await DoctorAvailability.findByIdAndDelete(doctorAvailabilityId);
        if (!doctorAvailability) {
            return res.status(404).json({ message: 'Doctor availability not found' });
        }
        res.status(200).json({ message: 'Doctor availability deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting doctor availability' });
    }
}

const getDoctorAvailabilityByDoctorId = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const doctorAvailability = await DoctorAvailability.find({ doctor: doctorId }).populate('doctor').populate('days').populate('time_slots');
        if (!doctorAvailability) {
            return res.status(404).json({ message: 'Doctor availability not found' });
        }
        res.status(200).json(doctorAvailability);
        
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching doctor availability' });
    }
}

const getDoctorAvailabilityByDate = async (req, res) => {
    try {
        const date = req.params.date;
        const doctorAvailability = await DoctorAvailability.find({ date }).populate('doctor').populate('days').populate('time_slots');
        if (!doctorAvailability) {
            return res.status(404).json({ message: 'Doctor availability not found' });
        }
        res.status(200).json(doctorAvailability);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching doctor availability' });
    }
}
}

module.exports = {
    getAllDoctorAvailability,
    getDoctorAvailabilityById,
    createDoctorAvailability,
    updateDoctorAvailability,
    deleteDoctorAvailability,
    getDoctorAvailabilityByDoctorId,
    getDoctorAvailabilityByDate
};
//
