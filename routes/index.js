var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer')
const config = require('../config')
const transporter = nodemailer.createTransport(config.mailer)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cadet who code - platform for sharing code.' });
});
router.get('/about', (req, res, next)=>res.render('about', {title: 'Cadet who code - platform for sharing code.'}))
router.route('/contact').get((req,res,next)=>{
  res.render('contact', { title: 'Cadet who code - platform for sharing code.' })
}).post((req,res,next)=>{
  req.checkBody('name', 'Empty name').notEmpty()
  req.checkBody('email', 'Invalid email').isEmail()
  req.checkBody('message', 'Empty message').notEmpty()
  let errors = req.validationErrors()
  if(errors){
    res.render('contact',{
      title:'Cadte who code - a platform for sharing code.',
      name:req.body.name,
      email:req.body.email,
      message:req.body.message,
      errorMessages:errors
    });
  } else {
    var mailOptions={
      from:'cadet who code <no-reply@cadetwhocode.com>',
      to:'cadetwhocode@gmail.com',
      subject:'You got a new message from visitor 😎',
      text:req.body.message
    }
    transporter.sendMail(mailOptions,(error, info)=>{
      if(error){
        return console.log(error)
      } else {
        res.render('thank', { title: 'Cadet who code - platform for sharing code.' })
      }
    })
  }
  
})

module.exports = router;
