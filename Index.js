const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
const db = require('./DB');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser())

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next) => { res.locals.messages = req.flash(); next(); });


app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', require('./routes/home_routes'))
app.use('/', require('./routes/admin_routes'))



const port = process.env.PORT || 3000

app.listen(port, () => {

    console.log('Server is Connected')

})
