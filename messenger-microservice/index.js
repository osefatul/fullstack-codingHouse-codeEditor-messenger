const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const Server = http.createServer(app);
const mongoDb = require('mongoose')
const bodyParser = require("body-parser");
require('dotenv').config();

const io = require('socket.io')(Server)

const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000'],
};

app.use(cors(corsOption));

const PORT = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


mongoDb.set('strictQuery', true);
console.log("Connected to MongoDB")
mongoDb.connect(process.env.MONGO_URL).then(
).catch(err => console.error(err));



io.on("connection", (socket)=>{
    socket.on("JOIN_CHAT", (user, roomId)=>{
        console.log(user, "JOINED CHAT")
    })
})






Server.listen(PORT, ()=>{
    console.log("Server listening on port " + PORT);
})
