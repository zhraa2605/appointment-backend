// controllers/userController.js
const User = require('../models/UsersModel');
const Doctor = require('../models/DoctorModel');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const filterAndPaginate = require('../utils/filterAndPaginate');
const mongoose = require('mongoose');
const logger = require('../Log/logger'); 

const handleError = (res, error, context = 'Server Error') => {
  logger.error(`${context}: ${error.message}`);
  return res.status(500).json({ success: false, message: context });
};

const register = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Attempt to register with existing email: ${email}`);
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password,
      role: 'user'
    });

    const token = generateToken(user._id, user.role);
    

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,   // For HTTP
      sameSite: 'lax', // Allows cookies on same-site requests
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    


    logger.info(`User registered: ${email}`);
    return res.status(200).json({
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        
      }
    });
  } catch (error) {
    return handleError(res, error, 'Error registering user');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.warn('Email or password missing in login');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed - email not found: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed - incorrect password for email: ${email}`);
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user._id, user.role);
    logger.info(`User logged in: ${email}`);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,   // For HTTP
      sameSite: 'none', // Allows cookies on same-site requests
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
   logger.info(`User logged in: ${email}`);
    return res.status(200).json({
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        
      }
    });
  } catch (error) {
    return handleError(res, error, 'Error logging in user');
  }
};


    
const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });    logger.info('User logged out');
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return handleError(res, error, 'Error logging out user');
  }
};


const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return handleError(res, error, 'Error fetching user');
  }
};

const editUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, role, is_active } = req.body;
    const userId = req.params.id;
    console.log(req.body)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const updateData = {
      ...(firstname && { firstname }),
      ...(lastname && { lastname }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(role && { role }),
      ...(is_active !== undefined && { is_active })
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    console.log('Updated user:', updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`User updated: ${userId}`);
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    return handleError(res, error, 'Error updating user');
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, name } = req.query;
    const filters = { name };
    const result = await filterAndPaginate(User, filters, page, limit);
    return res.status(200).json({ pagination: result.pagination, data: result.data });
  } catch (error) {
    return handleError(res, error, 'Error fetching users');
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found or delete failed' });
    }
    logger.info(`User deleted: ${req.params.id}`);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return handleError(res, error, 'Error deleting user');
  }
};

const addUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phone, role, is_active, password } = req.body;
    console.log(req.body)
    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
      password,
      role,
      is_active
    });

    if (role === "doctor") {
      const doctor = await Doctor.create({
        user: user._id,
        specializaton: "", // صح 
        bio: ""
      });

    }
    



    logger.info(`User created: ${user._id}`);
    return res.status(201).json({ user });
  } catch (error) {
    return handleError(res, error, 'Error creating user');
  }
};

module.exports = {
  register,
  login,
  logout,
  getUser,
  editUser,
  getAllUsers,
  deleteUser,
  addUser
};