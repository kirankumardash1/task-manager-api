const mongoose = require('mongoose');
const User = require('../models/user');
const TaskSchema = new mongoose.Schema({
    Description:{
        type: String,
        required: true
    },
    Completed:{
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
},{
    timestamps: true
});

const Tasks = mongoose.model('Tasks',TaskSchema);


module.exports = Tasks;