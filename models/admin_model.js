require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const JWT = require('jsonwebtoken')


const adminSchema = mongoose.Schema({

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

    Token: [{

        token: {

            type: String
        }
    }],

    Employee: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee_Model'
    }],

    Department: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'department_model'
    }],

    Leave: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'leave_model'
    }],

    Task: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'task_model'
    }]


});


adminSchema.methods.GenerateJWT = async function () {

    try {


        const token = JWT.sign({ _id: this._id.toString() }, process.env.Token_Password, { expiresIn: '365d' });
        this.Token = this.Token.concat({ token: token });
        await this.save();
        return token;

    }

    catch (error) {

        console.log('This is Admin JWT Generate error', error)

    }

}

adminSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        this.Password = await bcryptjs.hash(this.Password, 10);
    }
    next();
});


const admin_model = mongoose.model('admin_model', adminSchema);
module.exports = admin_model; 