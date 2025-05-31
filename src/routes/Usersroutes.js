const express = require('express');
const UserRouter = express.Router();
const { register, addUser, login, logout, getAllUsers, getUser, editUser, deleteUser } = require('../controllers/UsersControllers');
const { Auth } = require('../middleware/Auth');

// Register a new user
UserRouter.post('/register', register);

// login user
UserRouter.post('/login', login);

// Add a new user (Admin only)
UserRouter.post('/adduser',addUser);

// Logout user
UserRouter.post('/logout', Auth, logout);

// Get all users
UserRouter.get('/',Auth,  getAllUsers);

// Get user by ID
UserRouter.get('/:id', Auth, getUser);

// Update user by ID
UserRouter.put('/:id', Auth, editUser);

// Delete user by ID
UserRouter.delete('/:id', Auth, deleteUser);

module.exports = UserRouter;