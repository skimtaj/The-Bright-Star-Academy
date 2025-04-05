const mongoose = require('mongoose');
const studentSchema = mongoose.Schema({

    Name: {

        type: String
    },

    Gender: {

        type: String
    },

    DOB: {

        type: String
    },

    Category: {

        type: String
    },

    Religion: {

        type: String
    },

    Blood: {

        type: String
    },

    Profile_Image: {

        type: String
    },

    Address: {

        type: String
    },

    admissionDate: {

        type: String
    },

    admissionFor: {

        type: String
    },

    admissionFee: {

        type: Number
    },

    libraryFee: {

        type: Number
    },

    eventFee: {

        type: Number
    },

    totalOnetimeFees: {

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

    totalMonthlyFees: {

        type: Number
    },

    rollNo: {
        type: String
    },

    Mobile: {

        type: String
    },

    PreviousResult: {

        type: String
    },

    GuardianName: {

        type: String
    },

    GuardianMobile: {

        type: String
    },

    GuardianEmail: {

        type: String
    },

    paymentMethod: {

        type: String,

    },

    paymentVerification: {

        type: String
    },

    bankTransferProof: {
        type: String
    },

    qrPaymentProof: {

        type: String
    },

    cashPaymentReceiptNo: {

        type: String
    },

    academicYear: {

        type: String
    },

    Verification_Status: {

        type: String,
        default: 'Pending'
    },

    Cash_Recipt_Number: {

        type: String
    },

    Fees_Records: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'fees_model'
    }]


});

const student_model = mongoose.model('student_model', studentSchema);
module.exports = student_model;
