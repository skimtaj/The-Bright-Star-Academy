require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')
const JWT = require('jsonwebtoken')


const teacherSchema = mongoose.Schema({

    Name: {

        type: String
    },

    Mobile: {

        type: String
    },

    DOB: {

        type: String
    },

    Gender: {

        type: String
    },

    Address: {

        type: String
    },

    Profile_Image: {

        type: String
    },

    Qualifications: {

        type: String

    },

    Experience: {

        type: String

    },

    Specializations: {

        type: String

    },

    previousInstitute: {

        type: String
    },

    Email: {

        type: String
    },

    Password: {

        type: String
    },

    Token: [{

        token: {

            type: String
        }
    }],

    Attendance: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher_attendance_model'
    }]
})


teacherSchema.methods.generateTecaherToken = async function () {

    try {

        const token = JWT.sign({ _id: this._id.toString() }, process.env.Teacher_Token_Password, { expiresIn: '365d' });
        this.Token = this.Token.concat({ token: token });
        await this.save();
        return token;

    }

    catch (err) {

        console.log('This is tecaher Token generating error', err)

    }
}


teacherSchema.pre('save', async function (next) {
    if (this.isModified('Password')) {
        this.Password = await bcryptjs.hash(this.Password, 10);
    }
    next();
});

const teacher_model = mongoose.model('teacher_model', teacherSchema);
module.exports = teacher_model; 