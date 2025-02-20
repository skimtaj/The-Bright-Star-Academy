const mongoose = require('mongoose');

const salerySchema = mongoose.Schema({

    department: {

        type: String
    },

    employee: {
        type: String
    },

    salary: {

        type: String
    },

    date: {

        type: String
    },

    email: {

        type: String
    }

})

const salary_model = mongoose.model('salary_model', salerySchema);
module.exports = salary_model;