const mongoose = require('mongoose');
const classSchema = mongoose.Schema({

    className: {

        type: String
    },

    classTeacher: {

        type: String
    },

    registrationFee: {

        type: Number
    },

    tuitionFee: {

        type: Number
    },


    transportFee: {

        type: Number
    },


    mealFee: {

        type: Number
    },

    eventFee: {

        type: Number
    },

    libraryFees: {

        type: Number
    },

    totalOneTimeFees: {

        type: Number
    },


    totalMonthlyFees: {

        type: Number
    }


})

const class_model = mongoose.model('class_model', classSchema);
module.exports = class_model; 