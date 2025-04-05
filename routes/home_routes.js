const express = require('express');
const path = require('path')
const route = express.Router();
const multer = require('multer');

const { registrationComplete, onlineAdmissionPost, onlineAdmission, generalEnquiryPost, home, adminLogin, adminLoginPost, adminSignup, adminSignupPost } = require('../controllers/home_controllerjs')


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


route.get('/TBSA', home);

route.post('/TBSA/general-enquiry', generalEnquiryPost)


route.get('/TBSA/admin-login', adminLogin)
route.post('/TBSA/admin-login', adminLoginPost)

route.get('/TBSA/admin-signup', adminSignup)
route.post('/TBSA/admin-signup', upload.single('Profile_Image'), adminSignupPost)

route.get('/TBSA/admission-online', onlineAdmission);

const cpUpload = upload.fields([{ name: 'Profile_Image', maxCount: 1 }, { name: 'PreviousResult', maxCount: 8 }, { name: 'bankTransferProof', maxCount: 1 }, { name: 'qrPaymentProof', maxCount: 8 }])

route.post('/TBSA/admission-online', cpUpload, onlineAdmissionPost);


route.get('/registration-success/:id', registrationComplete)


module.exports = route; 
