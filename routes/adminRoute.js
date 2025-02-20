const express = require('express');
const route = express();
const multer = require('multer');
const path = require('path')
const auth = require('../adminAuth/adminAuth')

const { editAdminprofilePost, editAdminprofile, adminProfile, EmailNotFound, resetPasswordPost, resetPassword, forgetPassword, forgetPasswordPost, newAttendencePost, newAttendence, employeeAttendence, addTask, addTaskPost, rejecetLeave, acceptLeave, employeeSalary, addSalaryPost, addSalary, editDepartment, editDepartmentPost, deleteDepartment, addDepartment, addDepartmentPost, editEmployeePost, editEmployee, deleteEmployee, addEmployeePost, addEmployee, logout, adminDsahboard, adminLogin, adminSignup, adminSignuppost, adminLoginpost } = require('../controllers/adminController')

route.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    limits: { fileSize: 10000000 },
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
})

const upload = multer({ storage: storage })

route.get('/admin-login', adminLogin);
route.post('/admin-login', adminLoginpost);

route.get('/admin-signup', adminSignup)
route.post('/admin-signup', upload.single('Profile_Image'), adminSignuppost)
route.get('/admin-dashboard', auth, adminDsahboard)

route.get('/admin-dashboard/add-employee', auth, addEmployee)

route.post('/admin-dashboard/add-employee', upload.single('Profile_Image'), auth, addEmployeePost)

route.get('/delete-employee/:id', deleteEmployee)

route.get('/edit-employee/:id', editEmployee)
route.post('/edit-employee/:id', upload.single('Profile_Image'), editEmployeePost);

route.get('/admin-dashboard/add-department', auth, addDepartment)
route.post('/admin-dashboard/add-department', auth, addDepartmentPost);

route.get('/delete-department/:id', deleteDepartment);

route.get('/edit-department/:id', editDepartment)
route.post('/edit-department/:id', editDepartmentPost)

route.get('/admin-dashboard/add-salary', auth, addSalary)
route.post('/admin-dashboard/add-salary', auth, addSalaryPost)

route.get('/admin-dashboard/employee-salary/:id', employeeSalary)

route.get('/accept-leave/:id', acceptLeave)
route.get('/reject-leave/:id', rejecetLeave)

route.get('/admin-dashboard/add-task', auth, addTask)
route.post('/admin-dashboard/add-task', auth, addTaskPost)

route.get('/admin-dashboard/employee-attendace/:id', employeeAttendence);

route.get('/admin-dashboard/new-attendence/:id', newAttendence)
route.post('/admin-dashboard/new-attendence/:id', newAttendencePost)

route.get('/admin/forget-password', forgetPassword)
route.post('/admin/forget-password', forgetPasswordPost)

route.get('/admin-reset-password/:id', resetPassword)
route.post('/admin-reset-password/:id', resetPasswordPost)

route.get('/email-not-found', EmailNotFound)

route.get('/admin-profile', auth, adminProfile)

route.get('/admin-dashboard/edit-profile/:id', editAdminprofile)
route.post('/admin-dashboard/edit-profile/:id', upload.single('Profile_Image'), editAdminprofilePost)


route.get('/logout', logout)


module.exports = route