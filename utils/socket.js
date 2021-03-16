const {getUsers, users}  = require('./getUsers')
function socket(io){
    io.on('connection',(socket)=>{
        socket.on('joined-user', (data)=>{
            var user = {}
            console.log(socket.id)
            user[socket.id] = data.userName
            if(users[data.roomName]){
                users[data.roomName].push(user)
            } else{
                users[data.roomName]= [user]
            }
            socket.join(data.roomName)
            io.to(data.roomName).emit('joined-user', {userName: data.userName})
            io.to(data.roomName).emit('online-user', getUsers(users[data.roomName]))
        })
        socket.on('chat', (data)=>{
            console.log('chat')
            io.to(data.roomName).emit('chat', {userName: data.userName, message: data.message})
        })
        socket.on('typing', (data)=>{
            io.to(data.roomName).emit('typing', data.userName)
        })
        socket.on('disconnecting', ()=>{
            var rooms = Object.keys(socket.rooms)
            // get the keys of the room
            var socketId = rooms[0]
            var roomName = rooms[1]
            if(users[roomName]){
                users[roomName].forEach((user, index)=>{
                    if(user[socketId]){
                        user[roomName].splice(index,1);
                    }
                    io.to(roomName).emit('online-user', getUsers(users[roomName]))
                })
            }
        })
    })
};

module.exports = socket
