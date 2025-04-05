
const express = require('express');
const multer = require('multer');
const route = express.Router();
const auth = require('../auth/admin_dashboard_auth');
const path = require('path')

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



const { studentDueAmount, testing, resetPasswordPost, resetPassword, forgetPasswordPost, forgetPassword, logout, cashPaymentReceipt, downloadResult, studentQRProof, downloadStudentBankProof, downloadReceipt, deleteFeesrecord, downloadBankProof, downloadQRProof, editFeesPost, editFees, feesCollectPost, feesCollect, feesCollection, admissionVerification, studentProfile, deleteStudent, editStudentPost, editStudent, addStudentPost, addStudent, editFeesTypePost, editFeesType, addfeesTypePost, addfeesType, addAcademicYearPost, addAcademicYear, teacherAttendancePost, teacherAttendance, editClassPost, editClass, deleteSubject, editSubjectPost, editSubject, addSubjectPost, addSubject, addClassPost, addClass, addSectionPost, addSection, downloadTeacherIdcard, downloadTeacherExcel, teacherProfile, editTecaherPost, editTecaher, deleteTeacher, addTeacherPost, addTeacher, deleteGeneralEnquiry, adminDashboard, replyGeneralQuiryPost, replyGeneralQuiry } = require('../controllers/admin_controllers')

route.get('/TBSA/admin-dashboard', auth, adminDashboard)

route.get('/reply-general-quiry/:id', replyGeneralQuiry)
route.post('/reply-general-quiry/:id', replyGeneralQuiryPost)

route.get('/delete-general-enquiry/:id', deleteGeneralEnquiry)

route.get('/TBSA/admin-dashboard/add-teacher', auth, addTeacher)
route.post('/TBSA/admin-dashboard/add-teacher', auth, upload.single('Profile_Image'), addTeacherPost);

route.get('/delete-teacher/:id', deleteTeacher)

route.get('/edit-teacher/:id', editTecaher)
route.post('/edit-teacher/:id', upload.single('Profile_Image'), editTecaherPost)

route.get('/teacher-profile/:id', teacherProfile)

route.get('/download-teacher-excel', downloadTeacherExcel)

route.get('/download/teacher-idcard/:id', downloadTeacherIdcard)

route.get('/TBSA/admin-dashboard/add-section', auth, addSection)
route.post('/TBSA/admin-dashboard/add-section', auth, addSectionPost)

route.get('/TBSA/admin-dashboard/add-class', auth, addClass)
route.post('/TBSA/admin-dashboard/add-class', auth, addClassPost)

route.get('/TBSA/admin-dashboard/add-subject', auth, addSubject)
route.post('/TBSA/admin-dashboard/add-subject', auth, addSubjectPost)


route.get('/edit-subject/:id', editSubject);
route.post('/edit-subject/:id', editSubjectPost);

route.get('/delete-subject/:id', deleteSubject)

route.get('/edit-class/:id', editClass)
route.post('/edit-class/:id', editClassPost)

route.get('/teacher-attendance/:id', teacherAttendance)
route.post('/teacher-attendance/:id', teacherAttendancePost)

route.get('/TBSA/admin-dashboard/add-academic-year', auth, addAcademicYear)
route.post('/TBSA/admin-dashboard/add-academic-year', auth, addAcademicYearPost)

route.get('/TBSA/admin-dashboard/add-fees-type', auth, addfeesType)
route.post('/TBSA/admin-dashboard/add-fees-type', auth, addfeesTypePost);

route.get('/edit-fees-type/:id', editFeesType)
route.post('/edit-fees-type/:id', editFeesTypePost)

const cpUpload = upload.fields([{ name: 'Profile_Image', maxCount: 1 }, { name: 'bankTransferProof', maxCount: 8 }, { name: 'qrPaymentProof', maxCount: 8 }, { name: 'PreviousResult', maxCount: 8 }])


route.get('/TBSA/admin-dashboard/add-student', auth, addStudent);
route.post('/TBSA/admin-dashboard/add-student', auth, cpUpload, addStudentPost);


const cpUploads = upload.fields([{ name: 'Profile_Image', maxCount: 1 }, { name: 'PreviousResult', maxCount: 8 }, { name: 'bankTransferProof', maxCount: 8 }, { name: 'qrPaymentProof', maxCount: 8 }])


route.get('/edit-student/:id', editStudent)
route.post('/edit-student/:id', cpUploads, editStudentPost)

route.get('/delete-student/:id', deleteStudent);

route.get('/student-profilr/:id', studentProfile)

route.get('/admission-verification/:id', admissionVerification);

route.get('/fees-collection/:id', feesCollection);

route.get('/fees-collect/:id', feesCollect);

const feesProof = upload.fields([{ name: 'bankPaymentProof', maxCount: 1 }, { name: 'QRcodePaymentProof', maxCount: 8 }])

route.post('/fees-collect/:id', feesProof, feesCollectPost);

route.get('/edit-fees/:id', editFees);

const feesProofs = upload.fields([{ name: 'bankPaymentProof', maxCount: 1 }, { name: 'QRcodePaymentProof', maxCount: 8 }])

route.post('/edit-fees/:id', feesProofs, editFeesPost);

route.get('/download-QRCODE-proof/:id', downloadQRProof)
route.get('/download-bankProof/:id', downloadBankProof)

route.get('/delete-fees-record/:id', deleteFeesrecord)

route.get('/download-receipt/:id', downloadReceipt)

route.get('/studentBankproof/:id', downloadStudentBankProof);

route.get('/student-QR-proof/:id', studentQRProof)

route.get('/download-student-result/:id', downloadResult);

route.post('/cash-payment-receipt/:id', cashPaymentReceipt);

route.get('/logout', logout)

route.get('/forget-password', forgetPassword)
route.post('/forget-password', forgetPasswordPost)

route.get('/reset-pasword/:id', resetPassword)
route.post('/reset-pasword/:id', resetPasswordPost)



route.get('/student-due-amount/:id', studentDueAmount)

route.get('/testing', testing)
module.exports = route;