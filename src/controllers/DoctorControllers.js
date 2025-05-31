const Doctor = require('../models/DoctorModel');
const User = require('../models/UsersModel');
const logger = require('../Log/logger');

const handleError = (res, error, message = 'Internal Server Error', statusCode = 500) => {
  logger.error(`${message}: ${error.message}`);
  return res.status(statusCode).json({ success: false, message, error: error.message });
};

const getAllDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const skip = (page - 1) * limit;
    const filters = {};

    if (name) {
      filters.$or = [
        { 'user.firstname': { $regex: name, $options: 'i' } },
        { 'user.lastname': { $regex: name, $options: 'i' } },
      ];
    }

    const allDoctors = await Doctor.find({})
      .populate('user', 'firstname lastname email phone');

    let filteredDoctors = allDoctors;
    if (name) {
      const regex = new RegExp(name, 'i');
      filteredDoctors = allDoctors.filter((doc) =>
        regex.test(doc.user.firstname) || regex.test(doc.user.lastname)
      );
    }

    const paginatedDoctors = filteredDoctors.slice(skip, skip + parseInt(limit));

    logger.info(`Fetched ${paginatedDoctors.length} doctors`);
    return res.status(200).json({
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
        totalCount: filteredDoctors.length,
        totalPages: Math.ceil(filteredDoctors.length / limit),
      },
      data: paginatedDoctors,
    });
  } catch (error) {
    return handleError(res, error, 'Error fetching doctors');
  }
};

const getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
    const doctor = await Doctor.findById(id).populate('user', 'firstname lastname email');
    if (!doctor) {
      logger.warn(`Doctor not found: ${id}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    logger.info(`Fetched doctor by ID: ${id}`);
    return res.status(200).json(doctor);
  } catch (error) {
    return handleError(res, error, 'Error fetching doctor');
  }
};

const createDoctor = async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password, specializaton, bio } = req.body;
    const user = await User.create({ firstname, lastname, phone, email, role: 'doctor', password });
    const doctor = await Doctor.create({ user: user._id, specializaton, bio });

    logger.info(`Doctor created: ${doctor._id}, linked to user: ${user._id}`);
    return res.status(201).json(doctor);
  } catch (error) {
    return handleError(res, error, 'Error creating doctor');
  }
};

const updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { firstname, lastname, phone, email, password, specializaton, bio } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      logger.warn(`Doctor not found for update: ${doctorId}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.specializaton = specializaton || doctor.specializaton;
    doctor.bio = bio || doctor.bio;
    await doctor.save();

    const user = await User.findById(doctor.user);
    if (!user) {
      logger.warn(`Linked user not found for doctor ID: ${doctorId}`);
      return res.status(404).json({ message: 'Linked user not found' });
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    if (password) user.password = password;
    await user.save();

    logger.info(`Doctor and user updated: ${doctorId}`);
    return res.status(200).json({ message: 'Doctor and user updated successfully' });
  } catch (error) {
    return handleError(res, error, 'Error updating doctor and user');
  }
};

const deleteDoctor = async (req, res) => {

  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId).populate('user');
    if (!doctor) {
      logger.warn(`Doctor not found for deletion: ${doctorId}`);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await User.findByIdAndDelete(doctor.user.id);
    await doctor.deleteOne();

    logger.info(`Doctor and user deleted: ${doctorId}`);
    return res.status(200).json({ message: 'Doctor deleted' });
  } catch (error) {
    return handleError(res, error, 'Error deleting doctor');
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
