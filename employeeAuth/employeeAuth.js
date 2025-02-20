require('dotenv').config();
const express = require('express');
const app = express();
const JWT = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
app.use(cookieParser())

const employeeAuth = (req, res, next) => {

    const token = req.cookies.employeeToken;

    if (!token) {

        req.flash('error', 'You have to login first')
        return res.redirect('/employee-login')
    }

    const verified = JWT.verify(token, process.env.Employee_Token_Password);
    req.employeeId = verified._id;
    next();

}

module.exports = employeeAuth 