require('dotenv').config();
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const db = require('./DB');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const path = require('path')

app.use(cookieParser())

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next) => { res.locals.messages = req.flash(); next(); });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));
app.set('view engine', 'ejs');
app.use(bodyParser.json());


app.use('/', require('./routes/adminRoute'))
app.use('/', require('./routes/employeeRoute'))


const port = process.env.PORT || 3000

app.listen(port, () => {

    console.log('Server is connected')

})