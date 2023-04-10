const User=require ('../models/signup');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const path = require('path');
const passport = require('passport');
const session = require('express-session');

//for login
module.exports.login=async function (req,res) {
    const {email,password} =req.body;
    const user=await User.findOne({email});
    if(user){
        if(await bcrypt.compare(password,user.password)){
            req.session.user = user;
            req.flash('success','Login Successfull');
           return res.render('index', { user ,success:req.flash('success'),error:undefined});
           
        }
        req.flash('error','Incorrect Email/Password');
        console.log("Wrong password");
        return res.redirect('/');
    }
    req.flash('error','Incorrect Email/Password')
    console.log("email incorrect");
    return res.redirect('/');
}

//To reset password
module.exports.resetpassword=async function(req,res){
    const {password,confirmPassword}=req.body;
    const user=req.session.user;
    console.log(user.email);
    console.log(password);
    if(password !== confirmPassword){
        req.flash('error','Please Enter Same Passwords');
        return res.redirect('/project/reset-password');
    }
    else{
        const newHash=await bcrypt.hash(password,10);
        await User.findOneAndUpdate({email:user.email},{$set:{password:newHash}},{new:true});
        req.session.user=undefined;
        req.flash('success','Password reset successfully');
        return res.redirect('/');
    }
}

//register new account after checking into database
module.exports.register=async function (req, res) {
    const { name, email, password, confirmpassword } = req.body;
    const useremail=await User.findOne({email});
    if(useremail){
    if(email === useremail.email){
        req.flash('error','Account Already Exist')
        console.log("same email");
       return res.redirect('/');
    }
    else{
        if(password === confirmpassword){
            const hash=await bcrypt.hash(password,10);
            const user = new User({
                name,
                email,
                password: hash,
                confirmpassword: hash
        });
        user.save();
           req.flash('success','Account Created Successfully');
           return res.redirect('/');
    }
    req.flash('error','password and confirm-password must be same !');
    console.log("password not matching");
    return res.redirect('/');
}
    }
else{
    if(password === confirmpassword){
        const hash=await bcrypt.hash(password,10);
        const user = new User({
            name,
            email,
            password: hash,
            confirmpassword: hash
    });
    user.save();
        req.flash('success','Account Created Successfully');
       return res.redirect('/');
}
req.flash('error','password and confirm-password must be same !');
console.log("password not matching");
return res.redirect('/');
}
}

//logout by making session undefined
module.exports.logout=async function(req,res){
    req.session.user= undefined;
    req.flash('success','LogOut Successfull')
    return res.redirect('/');
}

//It will reset password
module.exports.reset=function(req,res){
    const user =req.session.user;
    const error=req.flash('error');
    if(user){
        res.render('reset-password',{user,error,success:undefined});
    }
    else{
        res.render('base');
    }
};

//used to controll direct access,cant access login page without login
module.exports.loginRoute=function(req,res) {
    const user=req.session.user;
    if(user){
        res.render('index',{user,success:undefined,error:undefined});
    }
    else{
        res.render('base',{success:undefined,error:undefined});
    }
};

//forgot password
module.exports.forgotpassword=async function(req,res){
    const {email}=req.body;
    const valid=await User.findOne({email});
    if(valid){
        if(email === valid.email){
        req.flash('success','Password sended to Email');
        return res.redirect('/project/forgot-password');
    }
}
    req.flash('error','Not a valid User');
        return res.redirect('/project/forgot-password');
}

//it will open up forgot password page
module.exports.forgotpage=function(req,res) {
    const success=req.flash('success');
    const error=req.flash('error');
    res.render('forgot-password',{success,error});
}







  /* User.findOne({ email }, async function(err, user) {
    try{
        if (err) {
            req.flash('message', 'An error occurred');
            res.redirect('/');
        } else if (user) {
            req.flash('message', 'Email already exists');
            res.redirect('/');
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    req.flash('message', 'An error occurred');
                    res.redirect('/');
                } else {
                    const user = new User({
                        name,
                        email,
                        password: hash,
                        confirmpassword: hash
                    });

                    user.save()
                        .then(() => {
                            req.session.user = user;
                            res.redirect('/');
                        });
                    }
                });
            }
        }
                        catch(err){
                            if (err.code === 11000) {
                                req.flash('message', 'Email already exists');
                                res.redirect('/');
                            } else {
                                req.flash('message', 'An error occurred');
                                res.redirect('/');
                            }
                        }
                    })
  };*/