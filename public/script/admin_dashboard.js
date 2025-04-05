let btnMenu = document.querySelector('.toggle-icon i'),
    menu = document.querySelector('.sidebar-wrapper'),
    closeBtn = document.querySelector('.close-menu i'),
    switcherBtn = document.querySelector('.switcher-icon i'),
    switcherContainer = document.querySelector('.switcher-container'),
    switcherClose = document.querySelector('.switcher-close i');

function addClass(button, containerName, className) {
    button.addEventListener('click', () => {
        containerName.classList.add(className);
    });
}

function removeClass(button, containerName, className) {
    button.addEventListener('click', () => {
        containerName.classList.remove(className);
    });
}

addClass(btnMenu, menu, 'active');
addClass(switcherBtn, switcherContainer, 'open');
removeClass(closeBtn, menu, 'active');
removeClass(switcherClose, switcherContainer, 'open');

let colorsBtn = document.querySelectorAll('.switcher-body ul li');

colorsBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        colorsBtn.forEach((btn) => {
            btn.classList.remove('active');
        });
        btn.classList.add('active');
        if (e.target.dataset.color === "#212529") {
            document.documentElement.style.setProperty('--lightGray', e.target.dataset.color);
            document.documentElement.style.setProperty('--whiteColor', '#2b3035');
            document.documentElement.style.setProperty('--textColor', '#9ca2a8');
            let colors = [e.target.dataset.color, '#2b3035', '#9ca2a8'];
            localStorage.setItem("colors-options", JSON.stringify(colors));
        } else {
            document.documentElement.style.setProperty('--lightGray', e.target.dataset.color);
            document.documentElement.style.setProperty('--whiteColor', '#ffffff');
            document.documentElement.style.setProperty('--textColor', '#4c5258');
            let colors = [e.target.dataset.color, '#ffffff', '#4c5258'];
            localStorage.setItem("colors-options", JSON.stringify(colors));
        }
    });
});

document.querySelectorAll('.sidebar-wrapper nav ul li.has-submenu').forEach((menuItem) => {
    const toggleLink = menuItem.querySelector('a');
    const submenu = menuItem.querySelector('.submenu');
    const dropdownIcon = menuItem.querySelector('.dropdown-icon');
    toggleLink.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.sidebar-wrapper nav ul li.has-submenu .submenu').forEach((otherSubmenu) => {
            if (otherSubmenu !== submenu) {
                otherSubmenu.classList.remove('active');
                otherSubmenu.parentElement.classList.remove('active');
            }
        });

        submenu.classList.toggle('active');
        menuItem.classList.toggle('active');
    });
});

$(document).ready(function () {
    $('#courseTable, #teacherTable, #classTable, #sectionTable, #subjectTable, #yearTable, #feesTable, #academicTable, #studentTable').each(function () {
        if ($(this).is('table')) {
            console.log("Initializing DataTable on:", $(this).attr('id'));
            $(this).DataTable({
                responsive: true
            });
        }
    });
});



const teacher = document.getElementById('teacherContainer');
const enquiry = document.getElementById('enquiryContainer');
const course = document.getElementById('classContainer');
const section = document.getElementById('sectionContainer');
const subject = document.getElementById('subjectContainer');
const academicYear = document.getElementById('academicContainer');
const fees = document.getElementById('feesContainer')
const student = document.getElementById('studentContainer')


const allTeacher = () => {

    enquiry.style.display = 'none';
    teacher.style.display = 'block';
    course.style.display = 'none';
    section.style.display = 'none';
    subject.style.display = 'none';
    academicYear.style.display = 'none'
    fees.style.display = 'none';
    student.style.display = 'none'
}

const dashboard = () => {

    enquiry.style.display = 'block';
    teacher.style.display = 'none';
    course.style.display = 'none';
    section.style.display = 'none';
    subject.style.display = 'none';
    academicYear.style.display = 'none'
    fees.style.display = 'none'
    student.style.display = 'none'
}

const allCourse = () => {

    enquiry.style.display = 'none';
    teacher.style.display = 'none';
    course.style.display = 'block';
    section.style.display = 'none';
    subject.style.display = 'none';
    academicYear.style.display = 'none';
    student.style.display = 'none'
    fees.style.display = 'none'
}

const allSubject = () => {
    enquiry.style.display = 'none';
    teacher.style.display = 'none';
    course.style.display = 'none';
    section.style.display = 'none';
    subject.style.display = 'block';
    academicYear.style.display = 'none'
    fees.style.display = 'none'
    student.style.display = 'none'

}

const allFees = () => {

    enquiry.style.display = 'none';
    teacher.style.display = 'none';
    course.style.display = 'none';
    section.style.display = 'none';
    subject.style.display = 'none';
    academicYear.style.display = 'none'
    fees.style.display = 'block'
    student.style.display = 'none'
}

const allStudents = () => {

    enquiry.style.display = 'none';
    student.style.display = 'block'
    course.style.display = 'none';
    section.style.display = 'none';
    subject.style.display = 'none';
    academicYear.style.display = 'none'
    fees.style.display = 'none'
}


const allAcademicYear = () => {

    academicYear.style.display = 'block'

    enquiry.style.display = 'none';
    teacher.style.display = 'none';
    course.style.display = 'none';
    section.style.display = 'none';
    subject.style.display = 'none';
    academicYear.style.display = 'block'
    fees.style.display = 'none'
}


$('#studentFilterButton').on('click', () => {

    let selectedYear = $('#year').val();
    let selectedClass = $('#cls').val();

    $('#studentTable tbody tr').each(function () {

        $(this).toggle(
            (selectedYear === "" || $(this).attr('data-year') === selectedYear) &&
            (selectedClass === "" || $(this).attr('data-course') === selectedClass)
        );

    })
})



