const express = require('express');
const Router = express.Router();
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const passport = require('passport');
const homecontroller=require('../controllers/home_controller');
const router = require('.');

Router.post('/signup',homecontroller.register);
Router.post('/login',homecontroller.login);
Router.get('/logout',homecontroller.logout);
Router.get('/login', homecontroller.loginRoute);
Router.get('/reset-password', homecontroller.reset);
Router.post('/reset-password',homecontroller.resetpassword);
Router.post('/forgot-password',homecontroller.forgotpassword);
Router.get('/forgot-password',homecontroller.forgotpage);
module.exports=Router;