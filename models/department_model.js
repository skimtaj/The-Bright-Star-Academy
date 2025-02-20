const mongoose = require('mongoose');
const departmentSchema = mongoose.Schema({

    departmentName: {

        type: String
    },

    description: {

        type: String
    }

})

const department_model = mongoose.model('department_model', departmentSchema)

module.exports = department_model