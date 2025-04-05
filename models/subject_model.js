const mongoose = require('mongoose');
const subjectSchema = mongoose.Schema({

    subjectName: {
        type: String
    },

    subjectCode: {

        type: String
    },

    subjectType: {

        type: String
    },

    subjectTeacher: {
        type: String
    }
});

const subject_model = mongoose.model('subject_model', subjectSchema);
module.exports = subject_model; 