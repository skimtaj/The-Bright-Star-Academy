require('dotenv').config();
const express = require('express');
const app = express();
const JWT = require('jsonwebtoken')

const cookieParser = require('cookie-parser');
app.use(cookieParser());


const adsminAuth = (req, res, next) => {

    const token = req.cookies.adminToken;
    if (!token) {

        req.flash('error', 'You have to Login')
        return res.redirect('/admin-login')
    }

    const verified = JWT.verify(token, process.env.Token_Password);

    req.adminId = verified._id;
    next();

}

module.exports = adsminAuth; 