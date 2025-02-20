
require('dotenv').config();
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const department_model = require('../models/department_model')
const admin_model = require('../models/admin_model')

const bcryptjs = require('bcryptjs')
const Employee_Model = require("../models/Employee_Model");
const leave_model = require('../models/leave_model');
const task_model = require('../models/task_model');

const employeeLogin = (req, res) => {

    res.render('../views/employee-login')

}

const employeeLoginPost = async (req, res) => {

    const { Email, Password } = req.body;
    const employeeEmail = await Employee_Model.findOne({ Email: Email });

    if (employeeEmail) {
        const matchPassword = await bcryptjs.compare(Password, employeeEmail.Password);

        if (matchPassword) {

            const token = await employeeEmail.GenerateEmployeetoken();
            res.cookie('employeeToken', token), {

                httpOnly: true,
                secure: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            }

            return res.redirect('/employee-dashboard')
        }

        else {
            req.flash('error', 'Incorrct Email or Password');
            return res.redirect('/employee-login')
        }

    }

    else {

        req.flash('error', 'Invalid Login details');
        return res.redirect('/employee-login')

    }

}

const employeeDashboard = async (req, res) => {

    const employeeID = req.employeeId;

    const employeeSourse = await Employee_Model.findById(employeeID).populate('Payment').populate('Task').populate('Leave');

    const totalTask = employeeSourse.Task.length

    res.render('../views/employee-dashboard', { employeeSourse, totalTask });

}

const leaveRequest = async (req, res) => {

    const department = await department_model.find();
    const employees = await Employee_Model.find();

    res.render('../views/leave-form', { department, employees })
}

const leaveRequestPost = async (req, res) => {

    const leaveData = req.body;
    const new_leave_model = leave_model(leaveData);
    await new_leave_model.save();

    const adminSourse = await admin_model.findOne();
    adminSourse.Leave.push(new_leave_model._id)
    await adminSourse.save();

    const employeeID = req.employeeId;

    const employeeSourse = await Employee_Model.findById(employeeID);
    employeeSourse.Leave.push(new_leave_model);
    await employeeSourse.save();

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.User,
            pass: process.env.Pass
        }
    });

    var mailOptions = {
        from: process.env.USER,
        to: adminSourse.Email,
        subject: 'Leave Notification',
        text: `Department : ${new_leave_model.department}, Name : ${new_leave_model.employee}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    req.flash('success', 'Leave request submitted successfully');
    return res.redirect('/employee-dashboard')

}

const viewTask = async (req, res) => {

    const taskSourse = await task_model.findById(req.params.id);

    res.render('../views/task-view', { taskSourse })

}

const taskProgress = async (req, res) => {

    const taskSourse = await task_model.findById(req.params.id);
    taskSourse.Status = 'Progress';
    await taskSourse.save();
    req.flash('success', 'Action taken successfuly');
    return res.redirect('/employee-dashboard')

}

const taskComplete = async (req, res) => {

    const taskSourse = await task_model.findById(req.params.id);
    taskSourse.Status = 'Complete';
    await taskSourse.save();
    req.flash('success', 'Action taken successfuly');
    return res.redirect('/employee-dashboard')

}

const employeeLogout = (req, res) => {

    res.clearCookie('employeeToken');
    return res.redirect('/employee-login')

}

module.exports = { employeeLogout, taskComplete, taskProgress, viewTask, leaveRequest, leaveRequestPost, employeeDashboard, employeeLogin, employeeLoginPost };

