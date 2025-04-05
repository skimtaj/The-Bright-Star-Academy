
require('dotenv').config();
const cron = require('node-cron')
const express = require('express');
const nodemailer = require('nodemailer')
const app = express();
const admin_model = require("../models/admin_model");
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs');
const general_enquiry_model = require('../models/general_enquiry_model');
const class_model = require('../models/class_model');
const academic_year_model = require('../models/academic_year_model');
const student_model = require('../models/student_model');

app.use(cookieParser());

const home = (req, res) => {

    res.render('../Views/home_page')
};

const adminLogin = (req, res) => {

    res.render('admin_login')

}

const adminLoginPost = async (req, res) => {

    const { Email, Password } = req.body;
    const adminEmail = await admin_model.findOne({ Email: Email });

    if (adminEmail) {

        const matchPassword = await bcryptjs.compare(Password, adminEmail.Password);
        if (matchPassword) {

            const token = await adminEmail.generateAdminToken();
            res.cookie('adminToken', token), {

                httpOnly: true,
                secure: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            }

            return res.redirect('/TBSA/admin-dashboard')

        }

        else {

            req.flash('error', 'Incorrcet Email or Password');
            return res.redirect('/TBSA/admin-login')
        }

    }

    else {

        req.flash('error', 'Invalid login details');
        return res.redirect('/TBSA/admin-login')
    }

}

const adminSignup = (req, res) => {

    res.render('admin_signup')

}

const adminSignupPost = async (req, res) => {

    const adminDetails = req.body;
    adminDetails.Profile_Image = req.file.filename;

    const new_admin_model = admin_model(adminDetails)
    await new_admin_model.save();
    req.flash('success', 'Admin Signup successfully');
    return res.redirect('/TBSA/admin-login')

}

const generalEnquiryPost = async (req, res) => {


    const adminSourse = await admin_model.find();

    const generalEnquiry = req.body;

    const generalEmail = await general_enquiry_model.findOne({ Email: generalEnquiry.Email });
    const generalMobile = await general_enquiry_model.findOne({ Mobile: generalEnquiry.Mobile });

    if (generalEmail) {

        req.flash('error', 'Email already exist');
        return res.redirect('/TBSA')
    }

    if (generalMobile) {
        req.flash('error', 'Mobile already exist');
        return res.redirect('/TBSA')
    }

    if (generalEnquiry.Mobile.length != 10) {

        req.flash('error', 'Mobile must be 10 digit');
        return res.redirect('/TBSA')
    }

    else {

        const new_enquiry = general_enquiry_model(generalEnquiry);
        await new_enquiry.save();

        const adminEmail = adminSourse.map((admin) => admin.Email.split(','))

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.User,
                pass: process.env.Pass
            }
        });

        const mailOptions = {
            from: process.env.User,
            to: adminEmail,
            subject: 'General Enquiry From TBSA Website',
            text: ` 
            Name : ${new_enquiry.Name}, 
            Mobile : ${new_enquiry.Mobile}, 
            Email : ${new_enquiry.Email}, 
            Message : ${new_enquiry.Message}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        req.flash('success', 'Your Enquiry Submitted successfully');
        return res.redirect('/TBSA')
    }

}

const onlineAdmission = async (req, res) => {

    const allClass = await class_model.find();
    const allAcademicYear = await academic_year_model.find();

    res.render('add_student', { allClass, allAcademicYear })

}


const onlineAdmissionPost = async (req, res) => {

    const onlineAdmission = req.body;

    onlineAdmission.Profile_Image = req.files['Profile_Image'][0].filename;
    onlineAdmission.PreviousResult = req.files['PreviousResult'][0].filename;

    if (req.files['bankTransferProof']) {

        onlineAdmission.bankTransferProof = req.files['bankTransferProof'][0].filename;
    }

    if (req.files['qrPaymentProof']) {

        onlineAdmission.qrPaymentProof = req.files['qrPaymentProof'][0].filename;
    }


    const prefixdata = {

        'Class 1': 'TMC',
        'Class 2': 'BJP',
        'Class 3': 'CPIM',
        'Class 4': 'ISF',
        'Class 5': 'JIO',
        'Class 6': 'AIRTEL',
        'Class 8': 'VODA',
        'Class 9': 'BSNL',
        'Class 10': 'IDEA',
        'Class 11': 'RCB',
        'Class 12': 'CSK'
    }

    const generaterollNo = async () => {

        const prefix = prefixdata[onlineAdmission.admissionFor] || 'gen';
        const count = await student_model.countDocuments({ admissionFor: onlineAdmission.admissionFor })
        return `${prefix}${String(count + 1).padStart(2, '0')}`
    }

    const rollNo = await generaterollNo();

    onlineAdmission.rollNo = rollNo;

    const new_onlineAdmission = student_model(onlineAdmission);
    await new_onlineAdmission.save();
    console.log(new_onlineAdmission)

    req.flash('success', 'Regitsration Completed successfully');
    return res.redirect(`/registration-success/${new_onlineAdmission._id}`);

}

const registrationComplete = async (req, res) => {

    const studentSourse = await student_model.findById(req.params.id)

    res.render('registration_completed_page', { studentSourse })

}



module.exports = {
    registrationComplete,
    onlineAdmissionPost,
    onlineAdmission,
    adminSignupPost,
    home,
    adminLogin,
    adminSignup,
    adminLoginPost,
    generalEnquiryPost
}
