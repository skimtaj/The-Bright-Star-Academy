
const cron = require('node-cron');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());



const { PDFDocument } = require('pdf-lib');
const fs = require('fs/promises');
const path = require('path')

const exceljs = require('exceljs')
const general_enquiry_model = require("../models/general_enquiry_model");
const nodemailer = require('nodemailer')
const admin_model = require('../models/admin_model');
const teacher_model = require('../models/teacher_model');
const section_model = require('../models/section_model');
const class_model = require('../models/class_model');
const subject_model = require('../models/subject_model');
const teacher_attendance_model = require('../models/teacher_attendance_model');
const academic_year_model = require('../models/academic_year_model');
const fees_type_model = require('../models/fees_type_model');
const student_model = require('../models/student_model');
const fees_model = require('../models/fees_model');

const adminDashboard = async (req, res) => {

    const generalEnquiry = await general_enquiry_model.find();
    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID).populate('Students').populate('Fees_Type').populate('Academic_Year').populate('Teacher').populate('Section').populate('Course').populate('Subjects')

    const totalStudent = adminSourse.Students.length;
    const totalTeachers = adminSourse.Teacher.length;
    const Students = await student_model.find();

    res.render('../Views/admin_dashboard', { generalEnquiry, adminSourse, Students, totalStudent, totalTeachers })

}

const replyGeneralQuiry = async (req, res) => {

    const enquirySourse = await general_enquiry_model.findById(req.params.id)

    res.render('../Views/G_enquire_reply', { enquirySourse })

}

const replyGeneralQuiryPost = async (req, res) => {

    const replyQuiry = req.body;
    await general_enquiry_model.findByIdAndUpdate(req.params.id, replyQuiry);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.User,
            pass: process.env.Pass
        }
    });

    var mailOptions = {
        from: process.env.User,
        to: replyQuiry.Email,
        subject: ' Enquiry Responsive ',
        text: ` Reply :  ${replyQuiry.Reply}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    const enquirySourse = await general_enquiry_model.findById(req.params.id);
    enquirySourse.Status = 'Replied';
    await enquirySourse.save();

    req.flash('success', 'Reply Send successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const deleteGeneralEnquiry = async (req, res) => {

    await general_enquiry_model.findByIdAndDelete(req.params.id);
    req.flash('success', 'General Enquiry Deleted Successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const addTeacher = (req, res) => {

    res.render('../Views/add_teacher')

}

const addTeacherPost = async (req, res) => {

    const teacherDetails = req.body;

    const teacherEmail = await teacher_model.findOne({ Email: teacherDetails.Email });
    const teacherMobile = await teacher_model.findOne({ Mobile: teacherDetails.Mobile });

    if (teacherEmail) {

        req.flash('error', 'Email already Exist');
        return res.redirect('/TBSA/admin-dashboard/add-teacher')
    }

    if (teacherMobile) {

        req.flash('error', 'Mobile already exist');
        return res.redirect('/TBSA/admin-dashboard/add-teacher')
    }

    if (teacherDetails.Mobile.length != 10) {

        req.flash('error', 'Mobile Must be 10 digit');
        return res.redirect('/TBSA/admin-dashboard/add-teacher')
    }


    teacherDetails.Profile_Image = req.file.filename;
    const new_Teacher_model = teacher_model(teacherDetails);
    await new_Teacher_model.save();


    const adminID = req.adminId;

    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Teacher.push(new_Teacher_model._id);
    await adminSourse.save();

    req.flash('success', 'Teacher Added successfully');
    return res.redirect('/TBSA/admin-dashboard');



}

const deleteTeacher = async (req, res) => {

    await teacher_model.findByIdAndDelete(req.params.id);
    req.flash('success', 'Techer Account deleted successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const editTecaher = async (req, res) => {

    const teacherSourse = await teacher_model.findById(req.params.id)

    res.render('../Views/edit_teacher', { teacherSourse })

}

const editTecaherPost = async (req, res) => {

    const editTecaherProfile = req.body;

    if (req.file) {

        editTecaherProfile.Profile_Image = req.file.filename;
    }

    if (editTecaherProfile.Mobile.length != 10) {

        req.flash('error', 'Mobile must be 10 digits');
        return res.redirect('/TBSA/admin-dashboard')
    }


    await teacher_model.findByIdAndUpdate(req.params.id, editTecaherProfile);
    req.flash('success', 'Tecaher profile edited successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const teacherProfile = async (req, res) => {

    const teacherSourse = await teacher_model.findById(req.params.id).populate('Attendance');
    const academicYear = await academic_year_model.find();

    res.render('../Views/teacher_profile', { teacherSourse, academicYear })
}

const downloadTeacherExcel = async (req, res) => {

    const teachers = await teacher_model.find();
    const workbook = new exceljs.Workbook();
    const sheet = workbook.addWorksheet('teachers')

    sheet.addRow(['Name', 'Mobile', 'Email', 'DOB', 'Gender', 'Address', 'Qualifications', 'Experience', 'Specializations', 'previousInstitute',])
    teachers.forEach((t) => {

        sheet.addRow([t.Name, t.Mobile, t.Email, t.DOB, t.Gender, t.Address, t.Qualifications, t.Experience, t.Specializations, t.previousInstitute])

    })

    res.setHeader("Content-Disposition", "attachment; filename=teachers.xlsx");
    await workbook.xlsx.write(res);
    res.end();

}

const downloadTeacherIdcard = async (req, res) => {

    try {

        const teacherSourse = await teacher_model.findById(req.params.id);

        async function CreatePdf(input, teacherSourse) {
            const existingPdfBytes = await fs.readFile(input);
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();

            form.getTextField('Name').setText(teacherSourse.Name || '');
            form.getTextField('Mobile').setText(teacherSourse.Mobile || '');
            form.getTextField('Email').setText(teacherSourse.Email || '');
            form.getTextField('DOB').setText(teacherSourse.DOB || '');

            const imagePath = path.join(__dirname, '../uploads', teacherSourse.Profile_Image);
            const imageBytes = await fs.readFile(imagePath);
            const fileExtension = path.extname(teacherSourse.Profile_Image).toLowerCase();

            let image;


            if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
                image = await pdfDoc.embedJpg(imageBytes);
            }

            else if (fileExtension === '.png') {

                image = await pdfDoc.embedPng(imageBytes);
            }


            const firstPage = pdfDoc.getPage(0);

            const imageWidth = 60;
            const imageHeight = 60;


            firstPage.drawImage(image, {
                x: 80,
                y: 200,
                width: imageWidth,
                height: imageHeight,
            });

            const pdfBytes = await pdfDoc.save();
            return pdfBytes;
        }

        const pdfBytes = await CreatePdf('./Teacher_IdCard/TBSA.pdf', teacherSourse);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Modified_Certificate.pdf"');
        res.end(pdfBytes);


    }

    catch (err) {


        console.log('Error:', err);
        res.status(500).send('An error occurred while processing the PDF.');
    }


}

const addSection = (req, res) => {

    res.render('../Views/add_section')

}

const addSectionPost = async (req, res) => {
    const sectionData = req.body;

    const capitalLetter = /^[A-Z]+$/;

    if (!capitalLetter.test(sectionData.sectionName)) {
        req.flash('error', 'Please enter capital characters only.');
        return res.redirect('/TBSA/admin-dashboard/add-section');
    }

    const new_section_model = section_model(sectionData);
    await new_section_model.save();

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Section.push(new_section_model._id);
    await adminSourse.save();

    req.flash('success', 'Section Added successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const addClass = async (req, res) => {

    const teacherSourse = await teacher_model.find();
    const sectionSourse = await section_model.find();
    const feesType = await fees_type_model.find();

    res.render('../Views/add_class', { teacherSourse, sectionSourse, feesType })
}

const addClassPost = async (req, res) => {

    const classDetails = req.body;
    const new_class_model = class_model(classDetails);
    await new_class_model.save();

    const adminID = req.adminId;

    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Course.push(new_class_model._id);
    await adminSourse.save();

    console.log(new_class_model);

    req.flash('success', 'Class added successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const addSubject = async (req, res) => {

    const teacherSourse = await teacher_model.find();

    res.render('../Views/add_subject', { teacherSourse })

}

const addSubjectPost = async (req, res) => {

    const subjectDetails = req.body;
    const new_subject_model = subject_model(subjectDetails);
    await new_subject_model.save();


    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Subjects.push(new_subject_model._id);
    await adminSourse.save();

    req.flash('success', 'Subject added succcessfully');
    return res.redirect('/TBSA/admin-dashboard');

}

const editSubject = async (req, res) => {

    const subjectSourse = await subject_model.findById(req.params.id);
    const teacherSourse = await teacher_model.find();

    res.render('../Views/edit_subject', { subjectSourse, teacherSourse })
}

const editSubjectPost = async (req, res) => {

    const editSubjectDetails = req.body;
    await subject_model.findByIdAndUpdate(req.params.id, editSubjectDetails);
    req.flash('success', 'subject updated successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const deleteSubject = async (req, res) => {

    await subject_model.findByIdAndDelete(req.params.id);
    req.flash('success', 'Subject deleted successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const editClass = async (req, res) => {

    const classSourse = await class_model.findById(req.params.id);
    const teacherSourse = await teacher_model.find();
    const sectionSourse = await section_model.find();

    res.render('../Views/edit_class', { classSourse, teacherSourse, sectionSourse })

}

const editClassPost = async (req, res) => {

    const editClassdetails = req.body
    await class_model.findByIdAndUpdate(req.params.id, editClassdetails);
    req.flash('success', 'Class edited successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const teacherAttendance = (req, res) => {

    res.render('../Views/teacher_attendance')

}

const teacherAttendancePost = async (req, res) => {

    const teacherAttendance = req.body;

    const teachers = await teacher_model.findById(req.params.id).populate('Attendance');
    const today = teachers.Attendance.some((attend) => attend.date === teacherAttendance.date);

    if (today) {

        req.flash('error', `Attendance already submitted for ${teachers.Name} today`);
        return res.redirect('/TBSA/admin-dashboard')
    }

    else {

        const new_teacher_attendance = teacher_attendance_model(teacherAttendance);
        await new_teacher_attendance.save();

        const teacherSourse = await teacher_model.findById(req.params.id);
        teacherSourse.Attendance.push(new_teacher_attendance._id);
        await teacherSourse.save();


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.User,
                pass: process.env.Pass
            }
        });

        const mailOptions = {
            from: process.env.User,
            to: teachers.Email,
            subject: 'Daily Attendance Notification',
            text: `Hey ${teachers.Name}! Today you are ${teacherAttendance.Status} in The Bright Star Academy, Date : ${teacherAttendance.date}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        req.flash('success', 'Attencence submitted successfully');
        return res.redirect('/TBSA/admin-dashboard')
    }


}

const addAcademicYear = (req, res) => {

    res.render('../Views/academic_year')

}

const addAcademicYearPost = async (req, res) => {

    const academicYear = req.body;
    const academic_year = academic_year_model(academicYear);
    await academic_year.save();

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Academic_Year.push(academic_year._id);
    await adminSourse.save();

    req.flash('success', 'Added new academic year successfully');
    return res.redirect('/TBSA/admin-dashboard')


}

const addfeesType = (req, res) => {

    res.render('../Views/add_fees_type')

}

const addfeesTypePost = async (req, res) => {

    const feesTypeData = req.body;
    const new_fees_type = fees_type_model(feesTypeData);
    await new_fees_type.save();

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Fees_Type.push(new_fees_type._id);
    await adminSourse.save();

    req.flash('success', 'New Fees Type added successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const editFeesType = async (req, res) => {

    const feesSourse = await fees_type_model.findById(req.params.id)

    res.render('../Views/edit_fees_type', { feesSourse })

}

const editFeesTypePost = async (req, res) => {

    const editFees = req.body;
    await fees_type_model.findByIdAndUpdate(req.params.id, editFees);
    req.flash('success', 'Fees type edited successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const addStudent = async (req, res) => {

    const allClass = await class_model.find();
    const allAcademicYear = await academic_year_model.find();

    res.render('../Views/add_student', { allClass, allAcademicYear })

}

const addStudentPost = async (req, res) => {


    const studentDetails = req.body;


    const preFix = {

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


    const generateUniqueroll = async () => {

        const prefix = preFix[studentDetails.admissionFor] || 'gen';
        const count = await student_model.countDocuments({ admissionFor: studentDetails.admissionFor });
        return `${prefix}${String(count + 1).padStart(2, '0')}`

    }

    const rollNo = await generateUniqueroll();
    studentDetails.rollNo = rollNo;

    if (req.files['Profile_Image']) {

        studentDetails.Profile_Image = req.files['Profile_Image'][0].filename
    }

    if (req.files['PreviousResult']) {

        studentDetails.PreviousResult = req.files['PreviousResult'][0].filename
    }

    if (req.files['bankTransferProof']) {

        studentDetails.bankTransferProof = req.files['bankTransferProof'][0].filename
    }

    if (req.files['qrPaymentProof']) {

        studentDetails.qrPaymentProof = req.files['qrPaymentProof'][0].filename
    }



    const new_Student_model = student_model(studentDetails);
    await new_Student_model.save();

    console.log(new_Student_model);

    const adminID = req.adminId;
    const adminSourse = await admin_model.findById(adminID);
    adminSourse.Students.push(new_Student_model._id);
    await adminSourse.save();

    req.flash('success', 'Student Added successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const editStudent = async (req, res) => {

    const allClass = await class_model.find();
    const student_sourse = await student_model.findById(req.params.id).populate('Fees_Records')
    const allAcademicYear = await academic_year_model.find();

    res.render('../Views/edit_student', { allClass, student_sourse, allAcademicYear })

}

const editStudentPost = async (req, res) => {

    const editStudent = req.body;

    if (req.files['Profile_Image']) {
        editStudent.Profile_Image = req.files['Profile_Image'][0].filename;
    }

    if (req.files['PreviousResult']) {

        editStudent.Profile_Image = req.files['PreviousResult'][0].filename;
    }

    if (req.files['bankTransferProof']) {

        editStudent.bankTransferProof = req.files['bankTransferProof'][0].filename
    };

    if (req.files['qrPaymentProof']) {

        editStudent.qrPaymentProof = req.files['qrPaymentProof'][0].filename

    }

    await student_model.findByIdAndUpdate(req.params.id, editStudent);


    req.flash('success', 'Student Profile updated successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const deleteStudent = async (req, res) => {

    await student_model.findByIdAndDelete(req.params.id);
    req.flash('success', 'Student Deleted successfully');
    return res.redirect('/TBSA/admin-dashboard');
}

const studentProfile = async (req, res) => {

    const studentProfile = await student_model.findById(req.params.id)

    res.render('../Views/student_profile', { studentProfile })

}

const admissionVerification = async (req, res) => {

    const student = await student_model.findById(req.params.id);
    student.Verification_Status = 'Verified';
    await student.save();
    req.flash('success', 'Stdent Verification Successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const feesCollection = async (req, res) => {

    const stdentSourse = await student_model.findById(req.params.id).populate('Fees_Records');
    const academicYears = await academic_year_model.find();

    res.render('../Views/fees_record', { stdentSourse, academicYears })

}

const feesCollect = async (req, res) => {

    const studentSourse = await student_model.findById(req.params.id);
    const academicYears = await academic_year_model.find();
    res.render('../Views/fees_collect', { studentSourse, academicYears })

}

const feesCollectPost = async (req, res) => {

    const student = await student_model.findById(req.params.id).populate('Fees_Records');


    const feesDetails = req.body;

    const existingPayment = await fees_model.findOne({ paymentYear: feesDetails.paymentYear, paymentMonth: feesDetails.paymentMonth });

    if (existingPayment) {
        req.flash('error', `Already Payment for ${feesDetails.paymentYear}, ${feesDetails.paymentMonth}`);
        return res.redirect(`/fees-collect/${student._id}`);
    }

    if (req.files['bankPaymentProof']) {

        feesDetails.bankPaymentProof = req.files['bankPaymentProof'][0].filename;
    }

    if (req.files['QRcodePaymentProof']) {

        feesDetails.QRcodePaymentProof = req.files['QRcodePaymentProof'][0].filename;
    }

    if (feesDetails.paidAmount != student.totalMonthlyFees) {

        req.flash('error', 'Invalid Payment Amount');
        return res.redirect(`/fees-collect/${student._id}`)
    }


    const new_fees_model = fees_model(feesDetails);
    await new_fees_model.save();

    const studentSourse = await student_model.findById(req.params.id);
    studentSourse.Fees_Records.push(new_fees_model._id);
    await studentSourse.save();
    console.log(new_fees_model)

    req.flash('success', 'Fees Added successfully');
    return res.redirect(`/fees-collection/${studentSourse._id}`)
}

const editFees = async (req, res) => {

    const feesSourse = await fees_model.findById(req.params.id);
    const academicYears = await academic_year_model.find();
    res.render('../Views/edit_fees', { feesSourse, academicYears })

}

const editFeesPost = async (req, res) => {


    const editFees = req.body;
    const feesSourse = await fees_model.findById(req.params.id);

    const studentSourse = await student_model.findOne({ rollNo: editFees.rollNo })


    if (editFees.paidAmount != feesSourse.feesAmount) {

        req.flash('error', 'Invalid payment Amount');
        return res.redirect(`/edit-fees/${feesSourse._id}`)
    }

    if (studentSourse) {

        await fees_model.findByIdAndUpdate(req.params.id, editFees);

        req.flash('success', 'Fees Updated Successfully');
        return res.redirect(`/fees-collection/${studentSourse._id}`)
    }

}

const downloadQRProof = async (req, res) => {

    const feesSourse = await fees_model.findById(req.params.id);
    const pdfpath = path.join(__dirname, '../uploads', feesSourse.QRcodePaymentProof);

    res.download(pdfpath, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
    });

}

const downloadBankProof = async (req, res) => {

    const feesSourse = await fees_model.findById(req.params.id)

    const pdfpath = path.join(__dirname, '../uploads', feesSourse.bankPaymentProof);

    res.download(pdfpath, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
    });


}

const deleteFeesrecord = async (req, res) => {

    await fees_model.findByIdAndDelete(req.params.id);
    req.flash('success', 'Fees Recored deleted successfully');
    return res.redirect('/TBSA/admin-dashboard')

}

const downloadReceipt = async (req, res) => {

    try {

        const feesDetails = await fees_model.findById(req.params.id);

        async function CreatePdf(input, feesDetails) {
            const existingPdfBytes = await fs.readFile(input);
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();

            form.getTextField('studentName').setText(feesDetails.studentName || '');
            form.getTextField('className').setText(feesDetails.className || '');
            form.getTextField('rollNo').setText(feesDetails.rollNo || '');
            form.getTextField('paymentMonth').setText(feesDetails.paymentMonth || '');

            form.getTextField('paymentYear').setText(feesDetails.paymentYear || '');
            form.getTextField('feesAmount').setText(feesDetails.feesAmount.toString() || '');
            form.getTextField('paidAmount').setText(feesDetails.paidAmount.toString() || '');
            form.getTextField('paymentDate').setText(feesDetails.paymentDate || '');

            form.getTextField('paymentMethod').setText(feesDetails.paymentMethod || '');


            const pdfBytes = await pdfDoc.save();
            return pdfBytes;
        }

        const pdfBytes = await CreatePdf('./Teacher_IdCard/TBSA (2) (2).pdf', feesDetails);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="Modified_Certificate.pdf"');
        res.end(pdfBytes);

    }

    catch (err) {

        console.log('Error:', err);
        res.status(500).send('An error occurred while processing the PDF.');
    }



}

const downloadStudentBankProof = async (req, res) => {

    const studentSourse = await student_model.findById(req.params.id);
    const pdfpath = path.join(__dirname, '../uploads', studentSourse.bankTransferProof);

    res.download(pdfpath, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
    });

}

const studentQRProof = async (req, res) => {

    const studentSourse = await student_model.findById(req.params.id);
    const pdfpath = path.join(__dirname, '../uploads', studentSourse.qrPaymentProof);

    res.download(pdfpath, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
    });

}

const downloadResult = async (req, res) => {

    const studentSourse = await student_model.findById(req.params.id);

    const pdfpath = path.join(__dirname, '../uploads', studentSourse.PreviousResult);

    res.download(pdfpath, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }
    });

}

const cashPaymentReceipt = async (req, res) => {

    const { Cash_Recipt_Number } = req.body;
    const studentSourse = await student_model.findByIdAndUpdate(req.params.id, { Cash_Recipt_Number });

    console.log(studentSourse.Cash_Recipt_Number)
    req.flash('success', 'cash Receipt Number successfully enterd');
    return res.redirect(`/student-profilr/${studentSourse._id}`)


}

const forgetPassword = (req, res) => {

    res.render('../Views/forget_Password')
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
            subject: 'Forget Password Notification',
            text: `Please reset your Password folling this link http://localhost:3000/reset-pasword/${adminEmail._id}`

        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        req.flash('success', 'Please check your Email');
        return res.redirect('/forget-password')
    }

    else {

        req.flash('error', 'Invalid Email');
        return res.redirect('/forget-password')

    }

}

const resetPassword = (req, res) => {

    res.render('../Views/reset_password')
}

const resetPasswordPost = async (req, res) => {

    const { Email, newPassword } = req.body;

    const matchAdminEmail = await admin_model.findOne({ Email: Email });

    if (matchAdminEmail) {

        matchAdminEmail.Password = newPassword;
        await matchAdminEmail.save();
        req.flash('success', 'Pasword Updated successfully');
        return res.redirect('/TBSA/admin-login')
    }

}


const logout = (req, res) => {

    res.clearCookie('adminToken');
    req.flash('error', 'You are successfully Logout')
    return res.redirect('/TBSA/admin-login')

}


module.exports = { studentDueAmount, testing, resetPasswordPost, resetPassword, forgetPasswordPost, forgetPassword, logout, cashPaymentReceipt, downloadResult, studentQRProof, downloadStudentBankProof, downloadReceipt, deleteFeesrecord, downloadBankProof, downloadQRProof, editFeesPost, editFees, feesCollectPost, feesCollect, feesCollection, admissionVerification, studentProfile, deleteStudent, editStudentPost, editStudent, addStudentPost, addStudent, editFeesTypePost, editFeesType, addfeesTypePost, addfeesType, addAcademicYearPost, addAcademicYear, teacherAttendancePost, teacherAttendance, editClassPost, editClass, deleteSubject, editSubjectPost, editSubject, addSubjectPost, addSubject, addClassPost, addClass, addSectionPost, addSection, downloadTeacherIdcard, downloadTeacherExcel, teacherProfile, editTecaherPost, editTecaher, deleteTeacher, addTeacherPost, addTeacher, deleteGeneralEnquiry, adminDashboard, replyGeneralQuiry, replyGeneralQuiryPost };
