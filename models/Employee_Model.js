require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const JWT = require('jsonwebtoken');

const employeeSchema = mongoose.Schema({

    Name: {

        type: String
    },

    Mobile: {

        type: String
    },

    Email: {

        type: String
    },

    Password: {

        type: String
    },

    Profile_Image: {

        type: String
    },

    Designation: {

        type: String
    },

    Merital_Status: {

        type: String
    },

    Salary: {

        type: String
    },

    Department: {

        type: String
    },

    Role: {

        type: String
    },

    Gender: {


        type: String
    },

    Token: [{

        token: {

            type: String
        }
    }],

    Payment: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'salary_model'
    }],

    Task: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'task_model'
    }],

    Attendence: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'attendence_model'
    }],

    Leave: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'leave_model'
    }]

});


employeeSchema.methods.GenerateEmployeetoken = async function () {

    try {

        const token = JWT.sign({ _id: this._id.toString() }, process.env.Employee_Token_Password, { expiresIn: '365d' });
        this.Token = this.Token.concat({ token: token });
        await this.save();
        return token;

    }

    catch (error) {

        console.log(' This is Employee Token generate error', error)
    }
}

employeeSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        this.Password = await bcryptjs.hash(this.Password, 10);
    }
    next();
});

const Employee_Model = mongoose.model('Employee_Model', employeeSchema);
module.exports = Employee_Model; 