const mongoose = require('mongoose');
const feesSchema = mongoose.Schema({

    studentName: {

        type: String
    },

    className: {

        type: String
    },

    rollNo: {

        type: String
    },


    paymentMonth: {

        type: String
    },

    paymentYear: {

        type: String
    },


    feesAmount: {

        type: Number
    },

    paidAmount: {

        type: Number
    },

    dueAmount: {

        type: Number
    },

    paymentDate: {

        type: String
    },

    paymentMethod: {

        type: String
    },

    bankPaymentProof: {

        type: String
    },

    QRcodePaymentProof: {

        type: String
    },

    Note: {

        type: String
    }
});

const fees_model = mongoose.model('fees_model', feesSchema);
module.exports = fees_model; 