// attach to the elements within the html
const output = document.getElementById('output')
const message = document.getElementById('message')
const send = document.getElementById('send')
const feedback = document.getElementById('feedback')
const roomMessage = document.querySelector('.room-message')
const users = document.querySelector('.users')

const socket = io.connect('http://localhost:3000')

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const roomName = urlParams.get('roomName')
const userName = urlParams.get('userName')

roomMessage.innerHTML = `Connected in room ${roomName}`;
// display the messages in the html

// when someone joins the room then this is going to appear
socket.emit('joined-user', {
    userName: userName,
    roomName: roomName
})

// attaches to this buttom and listens to any event named click
send.addEventListener('click',() =>{
    socket.emit('chat', {
        userName: userName,
        message: message.value,
        roomName: roomName
    })
    message.value = ''
})

// attaches to this input and listens for the event that is named keypress
message.addEventListener('keypress', ()=>{
    socket.emit('typing', {
        userName: userName,
        roomName: roomName,
    })
})

socket.on('joined-user',(data)=>{
    console.log('joined-user')
    console.log(data)
    output.innerHTML += '<p>--> <strong><em>' + data.userName + ' </strong>has Joined the Room</em></p>';
} )

socket.on('chat', (data)=>{
    console.log('chat')
    console.log(data)
    output.innerHTML += '<p><strong>' + data.userName + '</strong>: ' + data.message + '</p>';
    feedback.innerHTML = '';
    document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight
})

// output who is typing at this instant
socket.on('typing', (user)=>{
    console.log('typing')
    console.log(user)
    feedback.innerHTML = '<p><em>' + user + ' is typing...</em></p>';
})

// for each of the uers then output who is present
socket.on('online-user', (data)=>{
    console.log('online-user')
    console.log(data)
    users.innerHTML = ''
    data.forEach(user => {
        users.innerHTML += `<p>${user}</p>`
    });
})

