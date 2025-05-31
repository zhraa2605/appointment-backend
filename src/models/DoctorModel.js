const mongoose = require('mongoose');
const User = require('./UsersModel'); // Assuming you have a User model

const doctorsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        specializaton: {
            type: String,
            maxlength: 255,
        },
        bio : 
        {
            type: String,
        },
        created_at : {
            type: Date,
            default: Date.now,
        }
    },
);


module.exports = mongoose.model('Doctor', doctorsSchema);
