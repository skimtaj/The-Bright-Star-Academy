const mongoose = require('mongoose');
const sectionSchema = mongoose.Schema({

    sectionName: {

        type: String
    }

})

const section_model = mongoose.model('section_model', sectionSchema);
module.exports = section_model;