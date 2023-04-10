const express = require('express');
const session = require('express-session');
const router = express.Router();
const flash = require('connect-flash');

console.log('router loaded');
router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
router.use(flash());
router.get('/', (req, res) => {
    const user = req.session.user;
    const success = req.flash('success');
    const error =req.flash('error');
    if(user){
        res.render('index',{user,success,error});
    }
    else{
    res.render('base', { user,success,error});
    }
});
router.use('/project', require('./create'));

module.exports = router;