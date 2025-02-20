const mongoose = require('mongoose');
const leaveSchema = mongoose.Schema({

    department: {

        type: String
    },

    employee: {

        type: String
    },

    email: {

        type: String
    },

    date: {

        type: String
    },

    fromDate: {

        type: String
    },

    toDate: {

        type: String
    },

    reason: {
        type: String
    },

    Status: {

        type: String,
        default: 'Pending'
    }
})

const leave_model = mongoose.model('leave_model', leaveSchema);
module.exports = leave_model; 