require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const JWT = require('jsonwebtoken');


const adminSchema = mongoose.Schema({

    Name: {

        type: String
    },

    Mpbile: {

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

    Teacher: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher_model'
    }],


    Section: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'section_model'
    }],

    Course: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: "class_model"
    }],

    Subjects: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject_model'
    }],

    Academic_Year: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'academic_year_model'
    }],

    Fees_Type: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'fees_type_model'
    }],

    Students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student_model'
    }]

})

adminSchema.methods.generateAdminToken = async function () {

    try {

        const token = JWT.sign({ _id: this._id.toString() }, process.env.Admin_Token_Password, { expiresIn: '365d' });
        this.Token = this.Token.concat({ token: token });
        this.save();
        return token;

    }

    catch (err) {

        console.log('This is Admin Token generating error', err)

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