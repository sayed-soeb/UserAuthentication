const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const path = require('path');
const passport = require('passport');
const { profile } = require('console');
const GoogleStrategy = require( 'passport-google-oauth2').Strategy;
const port =8000;
const app = express();
require('dotenv').config();
// Connect to MongoDB
mongoose.connect(process.env.DbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// acquire connection (to check if its successful)
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

db.once('open', function () {
console.log('Connected to Database :: MongoDB');
});
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.use(flash());

//Google passport strategy for login using google accounts
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.callback || "http://localhost:8000/google/login",
    passReqToCallback   : true
  }, function(req,accessToken, refreshToken, profile, done){
                return done(null,profile);
            }));

//serialize to store data in session
passport.serializeUser(function (user,done) {
    done(null,user);
});

passport.deserializeUser(function (user,done) {
    done(null,user);
});

app.use(passport.initialize());
app.use(passport.session());

//authentication from google
app.get('/auth/google',
  passport.authenticate('google', { scope:
      ["profile","email"] }
));

//after get authentication following link execute
app.get( '/google/login',
    passport.authenticate( 'google', {
        failureRedirect: '/auth/google'}),
        function(req,res) {
          const user ={email:req.session.passport.user.email};
          console.log(user);
          console.log(req.session.passport.user.email);
            //success
            req.flash('success','Login Successfull');
           return res.render('google-login', { user ,success:req.flash('success'),error:undefined});
        }
);

// registration
app.get('/signup', (req, res) => {
    const message = req.flash('message')[0];
    res.render('signup', { message });
});

// use express router
app.use('/', require('./routes'));
app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${port}`);
});