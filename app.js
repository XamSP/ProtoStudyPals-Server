require('dotenv').config();
//const createError = require('http-errors');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
//const bcrypt       = require('bcrypt');
const session      = require('express-session');
const passport     = require("passport");
// const LocalStrategy= require("passport-local").Strategy;
// const User         = require("./models/user");
// const flash        = require("connect-flash");
const cors         = require('cors');

mongoose.Promise = Promise;
mongoose
  .connect(`mongodb://localhost/${process.env.MONGODB_URI}`, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const passportSetup = require('./config/passport');
passportSetup(passport);  

const app_name = require('./package.json').name;
//const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

// app.use((req, res, next) => {
//   // Adds user domain to be accessed from hbs to be used with axios on heroku 
//   req.userDomain = process.env.DOMAIN;
//   if(req.user){
//   User.findById(req.user._id)
//     .then(user => {
//       req.user = user;
//     });
//   }
//   // Allows request to be accessed from handlebars
//   app.locals.req = req;
//   // console.log(req.url)
//   next();
// });

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//Passport
// passport.serializeUser((user, cb) => {
//   cb(null, user._id);
// });

// passport.deserializeUser((id, cb) => {
//   User.findById(id, (err, user) => {
//     if (err) { return cb(err); }
//     cb(null, user); 
//   });
// });

// app.use(flash());
// passport.use(new LocalStrategy({
//   passReqToCallback: true
//   },(req, username, password, next) => {
//   User.findOne({ username }, (err, user) => {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return next(null, false, { message: "Incorrect username!!!" });
//     }
//     if (!bcrypt.compareSync(password, user.password)) {
//       return next(null, false, { message: "Incorrect password" });
//     }

//     return next(null, user);
//   });
// }));

app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: process.env.SECRET, /*Remember to put the .env SECRET variable*/ 
  resave: true,
  saveUninitialized: true,
  cookie : { httpOnly: true, maxAge: 2419200000 }
}));
app.use(cors());

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//routes
const authApi = require('./routes/auth-api');
const usersRouter = require('./routes/users');
const index = require('./routes/index');

app.use('/', index)
app.use('/', authApi);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;
