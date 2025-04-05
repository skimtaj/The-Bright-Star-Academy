const mongoose = require('mongoose');
const generaSchema = mongoose.Schema({

    Name: {

        type: String
    },

    Mobile: {

        type: String
    },

    Email: {

        type: String

    },

    Message: {

        type: String
    },

    Reply: {

        type: String
    },

    Status: {

        type: String,
        default: 'Pending'
    }

});

const general_enquiry_model = mongoose.model('general_enquiry_model', generaSchema);
module.exports = general_enquiry_model; 
