var express = require('express');
var router = express.Router();

router.get('/createTask', (req, res)=>{
    let newTask = new Task();

    newTask.save((err,data)=>{
        console.log(data)
        if(err){
            console.log(err)
            res.render('error')
        } else {
            res.redirect('/task/'+ data._id)
        }
    })
})
router.get('/task/:id', (req, res)=>{
    if(req.params.id){
        Task.findOne({_id:req.params.id},(err, data)=>{
            console.log('content', data)
            if(err){
                console.log(err)
                res.render('error')
            }
            if(data){
                res.render('task', {content:data.content, roomId:data.id})
            } else {
                res.render('error')
            }
        })
    } else {
        res.render('error')
    }
})

module.exports = router;