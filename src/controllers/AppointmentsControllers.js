const Appointment = require("../models/AppointmentsModel");
const mongoose = require("mongoose");
const User = require("../models/UsersModel");
const Doctor = require("../models/DoctorModel");
const filterAndPaginate = require("../utils/filterAndPaginate");
const sendNotification = require("../utils/sendNotification");
const getAllAppointments = async (req, res) => {
  try {
    const { date, status, sort = "desc" } = req.query;

    const filter = {};

    // Filter by date
    if (date) {
      // Directly compare the date field (as string) in MongoDB
      filter.date = date; // This assumes that the date field is stored as a string in YYYY-MM-DD format
    }

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .sort({ created_at: sort === "asc" ? 1 : -1 })
      .populate({
        path: "Patient",
        select: "firstname lastname",
      })
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "firstname lastname",
        },
      });

    res.json({ data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("Doctor")
      .populate("User");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment" });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { date, time, doctorId, userId, status } = req.body;

    if (!date || !time || !doctorId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
    });

    await sendNotification({
      user_id: userId,
      message: `Your appointment has been scheduled for ${date} at ${time}.`,
    });

    if (existing) {
      return res.status(409).json({
        message:
          "Appointment already exists at this date and time for the selected doctor",
      });
    }

    const appointment = await Appointment.create({
      doctor: new mongoose.Types.ObjectId(doctorId),
      Patient: new mongoose.Types.ObjectId(userId),
      date,
      time,
      status,
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res
      .status(500)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { status, cancel_reason } = req.body;

    if (
      status === "cancelled" &&
      (!cancel_reason || cancel_reason.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cancellation reason is required when status is set to cancelled",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    let message = "";
    if (req.body.status === "confirmed") {
      message = `Your appointment on ${appointment.date} at ${appointment.time} has been confirmed.`;
    } else if (req.body.status === "cancelled") {
      message = `Your appointment on ${appointment.date} at ${appointment.time} was cancelled.`;
    }
    if (message) {
      await sendNotification({ user_id: appointment.Patient, message });
    }

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error updating appointment" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully" });
    // Return the updated appointment
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment" });
    // Return an error if something goes wrong
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    console.log(user);
    console.log("userrole", user.role);
    if (user.role !== "user" && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. User is not authorized." });
    }

    const appointments = await Appointment.find({ Patient: userId })
      .populate("Patient")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "firstname lastname",
        },
      });

    console.log(appointments);

    res.json({ data: appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user appointments" });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }
    doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    if (doctor.user.role !== "doctor" || doctor.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. User is not a doctor." });
    }
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate("Patient")
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "firstname lastname",
        },
      });

    console.log(appointments);

    res.json({ data: appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user appointments" });
  }
};

const getAppointmentByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const appointments = await Appointment.find({ status })
      .populate("Doctor")
      .populate("User");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments by status" });
  }
};

const deleteAllAppointments = async (req, res) => {
  try {
    const result = await Appointment.deleteMany({});
    res.status(200).json({
      message: "All appointments have been deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting appointments:", error);
    res.status(500).json({ message: "Error deleting appointments" });
  }
};

module.exports = {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getUserAppointments,
  getDoctorAppointments,
  getAppointmentByStatus,

  updateAppointment,
  deleteAllAppointments,
};
