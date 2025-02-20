const mongoose = require('mongoose');
const attendenceSchema = mongoose.Schema({

    date: {

        type: String
    },

    status: {

        type: String
    },

    reason: {
        type: String
    }

})

const attendence_model = mongoose.model('attendence_model', attendenceSchema);
module.exports = attendence_model; 