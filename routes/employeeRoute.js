const express = require('express');
const route = express.Router();
const auth = require('../employeeAuth/employeeAuth')

const { employeeLogout, taskComplete, taskProgress, viewTask, leaveRequest, leaveRequestPost, employeeDashboard, employeeLogin, employeeLoginPost } = require('../controllers/employeeController')

route.get('/employee-login', employeeLogin)
route.post('/employee-login', employeeLoginPost)

route.get('/employee-dashboard', auth, employeeDashboard);

route.get('/employee-dashboard/leave-request', auth, leaveRequest)
route.post('/employee-dashboard/leave-request', auth, leaveRequestPost)

route.get('/employee-dashboatd/task/view/:id', viewTask);

route.get('/task-progress/:id', taskProgress);
route.get('/task-complete/:id', taskComplete)

route.get('/employee-logout', employeeLogout)

module.exports = route; 