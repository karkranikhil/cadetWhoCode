'use strict'

var socketIO = require('socket.io')
var ot = require('ot')
var roomList ={}
module.exports=((server)=>{
    var str = `This is a markdown heading 
    let i = i+1;`
    var io= socketIO(server)
    io.on('connection',((socket)=>{
        socket.on('joinRoom', ((data)=>{
            if(!roomList[data.room]){
                var socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, function(socket,cb){
                   var self = this
                   console.log(self)
                   Task.findByIdAndUpdate(data.room, {content:self.document},function(err){
                       if(err) return cb(false)
                       cb(true)
                   })
                })
                roomList[data.room] = socketIOServer
            }
            roomList[data.room].addClient(socket)
            roomList[data.room].setName(socket, data.username)
            socket.room = data.room
            socket.join(data.room)
        }))
        socket.on('chatMessage', ((data)=>{
            io.to(socket.room).emit('chatMessage', data)
        }))
        socket.on('disconnect', ()=>{
            socket.leave(socket.room)
        })
    }))
})