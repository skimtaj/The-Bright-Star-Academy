const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({

    Department: {

        type: String
    },

    Employee: {

        type: String
    },

    taskTitle: {

        type: String
    },

    Description: {

        type: String
    },

    deadline: {

        type: String
    },

    Status: {

        type: String,
        default: 'Pending'
    }


})

const task_model = mongoose.model('task_model', taskSchema);
module.exports = task_model