const express = require("express")
const bodyParser = require("body-parser")
const socket = require("socket.io")

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
var port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/room', (req, res) =>{
    res.render('room')
});

app.post('/room', (req, res) => {
    const roomName = req.body.roomName;
    const userName = req.body.userName;
    res.redirect(`/room?userName=${userName}&roomName=${roomName}`);
})

const server = app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`)
})

const io = socket(server, {allowEIO3: true})
require('./utils/socket')(io)


/*
 * Design Notes:
 * Use websocket for transfering data, who joins and what messages appear
 *
 * User flow:
 * 1. Index is where user signs up and then logs into a room
 * 2. Index sends the user to the specific room and this is routed in the URL.
 * 3. Websocket handles the requests for the room, and the js incorporates additional html and etc in order
 * to actually display this
 *
 *
 */
