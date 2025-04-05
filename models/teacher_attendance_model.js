const mongoose = require('mongoose');
const attendanceSchema = mongoose.Schema({

    date: {

        type: String
    },

    Status: {

        type: String
    },

    Note: {

        type: String
    }

});

const teacher_attendance_model = mongoose.model('teacher_attendance_model', attendanceSchema);
module.exports = teacher_attendance_model; 