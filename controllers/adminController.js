

require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bcryptjs = require('bcryptjs');
const admin_model = require("../models/admin_model");
const Employee_Model = require('../models/Employee_Model');
const department_model = require('../models/department_model');
const salary_model = require('../models/salary_model');
const leave_model = require('../models/leave_model');
const task_model = require('../models/task_model');
const attendence_model = require('../models/attendence_model');

const adminLogin = (req, res) => {

    res.render('../views/admin-login')

}

const adminLoginpost = async (req, res) => {

    const { Email, Password } = req.body;

    const adminEmail = await admin_model.findOne({ Email: Email });

    if (adminEmail) {

        const matchPassword = await bcryptjs.compare(Password, adminEmail.Password);

        if (matchPassword) {

            const token = await adminEmail.GenerateJWT();
            res.cookie('adminToken', token), {

                httpOnly: true,
                secure: true,
                maxAge: 365 * 24 * 60 * 60 * 1000,
            }

            return res.redirect('/admin-dashboard')
        }

        else {

            req.flash('error', 'Incorrcet Email or Password');
            return res.redirect('/admin-login')
        }
    }

    else {
        req.flash('error', 'Invalid login details')
        return res.redirect('/admin-login')
    }

}

const adminSignup = (req, res) => {

    res.render('../views/admin-signup')

}

const adminSignuppost = async (req, res) => {

    try {

        const adminData = req.body;
        adminData.Profile_Image = req.file.filename;

        const adminEmail = await admin_model.findOne({ Email: adminData.Email });
        const adminMobile = await admin_model.findOne({ Mobile: adminData.Mobile });

        if (adminEmail) {

            req.flash('error', 'Email already exist');
            return res.redirect('/admin-signup')
        }

        if (adminMobile) {

            req.flash('error', 'Mobile already exist');
            return res.redirect('/admin-signup')
        }

        const new_admin_model = admin_model(adminData);
        await new_admin_model.save();
        return res.redirect('/admin-login')
    }

    catch (error) {

        req.flash('error', 'This is Signup error')
        console.log('This is Signup error', error);
        return res.redirect('/admin-signup')
    }

}

const adminDsahboard = async (req, res) => {

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID).populate('Employee').populate('Department')
    const totalEmployees = adminSourse.Employee.length;
    const totalDepartment = adminSourse.Department.length
    const leave = await leave_model.find();
    const totalLeave = leave.length;

    res.render('../views/admin-dashboard', { adminSourse, leave, totalEmployees, totalDepartment, totalLeave })

}

const logout = (req, res) => {

    res.clearCookie('adminToken');
    return res.redirect('/admin-login')

}

const addEmployee = async (req, res) => {

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID).populate('Department')
    res.render('../views/add-employee', { adminSourse })
}

const addEmployeePost = async (req, res) => {

    const employeeData = req.body;
    employeeData.Profile_Image = req.file.filename;

    const employeEmail = await Employee_Model.findOne({ Email: employeeData.Email });
    const employeMobile = await Employee_Model.findOne({ Mobile: employeeData.Mobile });

    if (employeEmail) {

        req.flash('error', 'Email already exist ');
        return res.redirect('/admin-dashboard/add-employee')

    }

    if (employeMobile) {

        req.flash('error', 'Mobile already exist ');
        return res.redirect('/admin-dashboard/add-employee')

    }

    const new_employee_model = Employee_Model(employeeData);
    await new_employee_model.save();

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Employee.push(new_employee_model._id);
    await adminSourse.save();


    req.flash('success', 'New Employee added successfully');
    return res.redirect('/admin-dashboard')

}

const deleteEmployee = async (req, res) => {

    await Employee_Model.findByIdAndDelete(req.params.id);
    req.flash('success', 'Empoloyee deleted successfully');
    return res.redirect('/admin-dashboard')

}

const editEmployee = async (req, res) => {

    const editEmployee = await Employee_Model.findById(req.params.id);
    const department = await department_model.find();

    res.render('../views/edit-employee', { editEmployee, department, })

}

const editEmployeePost = async (req, res) => {

    const editEmployee = req.body;

    if (req.file) {
        editEmployee.Profile_Image = req.file.filename
    }

    await Employee_Model.findByIdAndUpdate(req.params.id, editEmployee);
    req.flash('success', 'Employee updated succesfully');
    return res.redirect('/admin-dashboard')

}

const addDepartment = (req, res) => {

    res.render('../views/add-department')
}

const addDepartmentPost = async (req, res) => {

    const departmentData = req.body;
    const new_department_model = department_model(departmentData)
    await new_department_model.save();

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Department.push(new_department_model._id);
    await adminSourse.save();

    req.flash('success', 'New depaermtnt added successfully')
    return res.redirect('/admin-dashboard')

}

const deleteDepartment = async (req, res) => {

    await department_model.findByIdAndDelete(req.params.id);
    req.flash('success', 'Department deleted succesfully');
    return res.redirect('/admin-dashboard')

}

const editDepartment = async (req, res) => {

    const departmentSourse = await department_model.findById(req.params.id)

    res.render('../views/edit-department', { departmentSourse })

}

const editDepartmentPost = async (req, res) => {

    const { departmentName, description } = req.body;
    await department_model.findByIdAndUpdate(req.params.id, { departmentName, description })
    req.flash('success', 'Department updated successfully');
    return res.redirect('/admin-dashboard')

}

const addSalary = async (req, res) => {

    const department = await department_model.find();
    const employees = await Employee_Model.find();

    res.render('../views/add-salary', { department, employees })
}

const addSalaryPost = async (req, res) => {

    const salaryData = req.body;
    const new_salary_model = salary_model(salaryData);
    await new_salary_model.save();

    const employeeSourse = await Employee_Model.findOne({ Name: new_salary_model.employee });

    if (employeeSourse) {

        employeeSourse.Payment.push(new_salary_model._id);
        await employeeSourse.save();

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });

        var mailOptions = {
            from: process.env.USER,
            to: employeeSourse.Email,
            subject: 'Payment Message',
            text: `Hey ${employeeSourse.Name}! Your payment is done `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.redirect('/admin-dashboard')
    }

    else {

        req.flash('error', 'Employee not found');
        return res.redirect('/admin-dashboard/add-salary')

    }

}

const employeeSalary = async (req, res) => {

    const employeeSourse = await Employee_Model.findById(req.params.id).populate('Payment')

    res.render('../views/salery-page', { employeeSourse })
}

const acceptLeave = async (req, res) => {

    const leaveSourse = await leave_model.findById(req.params.id);
    leaveSourse.Status = 'Accepted';
    await leaveSourse.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.User,
            pass: process.env.Pass
        }
    });

    const mailOptions = {
        from: process.env.User,
        to: leaveSourse.email,
        subject: 'Leave Accept Notification',
        text: `Hey ${leaveSourse.employee}! Your leave request is accepted`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    req.flash('success', 'Leave accepted successfully');
    return res.redirect('/admin-dashboard');

}

const rejecetLeave = async (req, res) => {

    const leaveSourse = await leave_model.findById(req.params.id);
    leaveSourse.Status = 'Rejected';
    await leaveSourse.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.User,
            pass: process.env.Pass
        }
    });

    const mailOptions = {
        from: process.env.User,
        to: leaveSourse.email,
        subject: 'Leave Reject Notification',
        text: `Hey ${leaveSourse.employee}! Your leave request is rejected for several reason`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    req.flash('success', 'Leave accepted successfully');
    return res.redirect('/admin-dashboard');


}

const addTask = async (req, res) => {

    const departments = await department_model.find();
    const employees = await Employee_Model.find();

    res.render('../views/add-task', { departments, employees })

}

const addTaskPost = async (req, res) => {

    const tasks = req.body;
    const new_task_model = task_model(tasks)
    await new_task_model.save();

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Task.push(new_task_model._id);
    await adminSourse.save();

    const employeeSourse = await Employee_Model.findOne({ Name: new_task_model.Employee });
    employeeSourse.Task.push(new_task_model._id);
    await employeeSourse.save();

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.User,
            pass: process.env.Pass
        }
    });

    var mailOptions = {
        from: process.env.User,
        to: employeeSourse.Email,
        subject: 'New Task Notification',
        text: `Hey ${new_task_model.Employee}! assign a new vtask for you`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


    req.flash('success', 'Task added successfully')
    return res.redirect('/admin-dashboard')

}

const employeeAttendence = async (req, res) => {

    const employeeSourse = await Employee_Model.findById(req.params.id).populate('Attendence')

    res.render('../views/employee-attendence', { employeeSourse })

}

const newAttendence = async (req, res) => {

    res.render('../views/attendace-form')

}

const newAttendencePost = async (req, res) => {

    const attendence = req.body;
    const new_attendence_model = attendence_model(attendence)
    await new_attendence_model.save();

    const employeeSourse = await Employee_Model.findById(req.params.id);

    employeeSourse.Attendence.push(new_attendence_model._id)
    await employeeSourse.save();
    req.flash('success', 'Attendence submitted successfully');
    return res.redirect('/admin-dashboard')


}

const forgetPassword = (req, res) => {

    res.render('../views/forget-password')

}

const forgetPasswordPost = async (req, res) => {

    const { Email } = req.body;
    const adminEmail = await admin_model.findOne({ Email: Email });

    if (adminEmail) {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.User,
                pass: process.env.Pass
            }
        });

        var mailOptions = {
            from: process.env.User,
            to: adminEmail.Email,
            subject: 'Password Setting Notification',
            text: `Please Reset Your Password using this link : http://localhost:3000/admin-reset-password/${adminEmail._id}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        req.flash('success', 'Plesae Check Your Email');
        return res.redirect('/admin/forget-password')

    }

    else {

        req.flash('error', 'Have Not Account With This Email');
        return res.redirect('/admin/forget-password')
    }


}

const resetPassword = (req, res) => {

    res.render('../views/reset-password')
}

const resetPasswordPost = async (req, res) => {

    const { Email, Password } = req.body;

    const adminEmail = await admin_model.findOne({ Email: Email });

    if (adminEmail) {

        adminEmail.Password = Password;
        await adminEmail.save();
        req.flash('success', 'Password Update successfully');
        return res.redirect('/admin-login');

    }

    else {

        return res.redirect('/email-not-found')

    }


}

const EmailNotFound = (req, res) => {

    res.render('../views/email-not-found.ejs')

}

const adminProfile = async (req, res) => {

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID)

    res.render('../views/admin-profile', { adminSourse })

}

const editAdminprofile = async (req, res) => {

    const adminSourse = await admin_model.findById(req.params.id)

    res.render('../views/edit-admin-profile', { adminSourse })

}

const editAdminprofilePost = async (req, res) => {

    const updatedata = req.body;

    if (req.file) {
        updatedata.Profile_Image = req.file.filename
    }

    await admin_model.findByIdAndUpdate(req.params.id, updatedata);

    req.flash('success', 'profile Updated Successfully');
    return res.redirect('/admin-dashboard')

}


module.exports = { editAdminprofilePost, editAdminprofile, adminProfile, EmailNotFound, resetPasswordPost, resetPassword, forgetPasswordPost, forgetPassword, newAttendencePost, newAttendence, employeeAttendence, addTaskPost, addTask, rejecetLeave, acceptLeave, employeeSalary, addSalaryPost, addSalary, editDepartment, editDepartmentPost, deleteDepartment, addDepartment, addDepartmentPost, editEmployeePost, editEmployee, deleteEmployee, addEmployee, addEmployeePost, logout, adminDsahboard, adminLogin, adminLoginpost, adminSignup, adminSignuppost };