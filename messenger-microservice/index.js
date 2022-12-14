const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const Server = http.createServer(app);
const mongoDb = require('mongoose')
const bodyParser = require("body-parser");
const router = require('./routes');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const io = require('socket.io')(Server)



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});


app.use(cookieParser());
const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000'],
};

app.use(cors(corsOption));

const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(router);

mongoDb.set('strictQuery', true);
console.log("Connected to MongoDB")
mongoDb.connect(process.env.MONGO_URL).then(
).catch(err => console.error(err));


const userSocketMap = {};


io.on("connection", (socket)=>{
    console.log('socket connected', socket.id);

    socket.on("JOIN_CHAT", ({user, roomId})=>{

        userSocketMap[socket.id] = user;
        socket.join(roomId);
    })


    socket.on("SEND_MESSAGE", ({roomId, message})=>{
        console.log("SendMessage", roomId, message)

        socket.in(roomId).emit("RECEIVE_MESSAGE", {roomId, message})
    })
})




Server.listen(PORT, ()=>{
    console.log("Server listening on port " + PORT);
})
