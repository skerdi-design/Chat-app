const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils.js");
const { userJoin,getRoomUsers,getCurrentUser,userLeave } = require("./users.js");



const app = express();
const server = http.createServer(app);
const io = socketio(server);//inicilazing the socket



io.on('connection' , socket => {
    // console.log("a user has conected");
    socket.on('joinRoom', ({username,room})=>{
        const user = userJoin(socket.id,username,room);

        socket.join(user.room);
        //welcoming the user
        socket.emit('message',formatMessage('Chat Bot','Welcome to Chat Bot'));
        //informing other user about logging
        socket.broadcast.to(user.room).emit('message',formatMessage('Chat Bot',`${user.username} has joined the Chat`));
        //sending users and room info
        io.to(user.room).emit('roomUsers', {
            room:user.room,//the current room
            users: getRoomUsers(user.room)//array of all the users in said room
        })
    })

    //listen for chat messages
    socket.on('message', msg =>{
        //find the user
        const user = getCurrentUser(socket.id);
        //output the message
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })
    //runs when client discconects
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage('ChatBot',`${user.username} has left the Chat`));
        
            //retun the updated array
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});




//running the static files
app.use(express.static("public"));

//running the port
const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>{
    console.log('server running at port' + PORT);
})