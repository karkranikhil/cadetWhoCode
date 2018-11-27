const express = require('express');
const router = express.Router();
const passport = require('passport')

router.route('/login')
.get((req, res, next)=>{
    res.render('login', {title:'Login your account'})
}).post(passport.authenticate('local',{
    failureRedirect:'login'
}),(req,res)=>{
    res.redirect('/')
})


router.route('/register')
.get((req, res, next)=>{
    res.render('register', {title:'Register a new account'})
}).post((req, res, next)=>{
    req.checkBody('name', 'Empty Name').notEmpty()
    req.checkBody('email', 'Invalid Email').isEmail()
    req.checkBody('password', 'Empty password').notEmpty()
    req.checkBody('password', 'Password do not match').equals(req.body.confirmPassword).notEmpty()

    var errors = req.validationErrors();
    if(errors){
        res.render('register',{
            name:req.body.name,
            email:req.body.email,
            errorMessages:errors
        });
    } else {
        let user = new User()
        user.name=req.body.name
        user.email=req.body.email
        user.setPassword(req.body.password)
        user.save((err)=>{
            if(err){
                res.render('register',{
                    errorMessages:err
                })
            } else {
                res.redirect('/login')
            }
        })
    }
})

router.get('/logout', function(req,res){
    req.logout()
    res.redirect('/')
})

router.get('/auth/facebook', passport.authenticate('facebook', {scope:'email'}))
router.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect:'/',
    failureRedirect:'/'
}))
module.exports = router