const mongoose = require('mongoose');

const feesSchema = mongoose.Schema({

    feesTypeName: {

        type: String
    },


});

const fees_type_model = mongoose.model('fees_type_model', feesSchema);
module.exports = fees_type_model; 