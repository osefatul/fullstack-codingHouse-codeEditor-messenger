const express = require("express");
const mongoDb = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();

const {generateFile} = require("./generateFiles")
const {executeCpp} = require("./executeCpp")




app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        next();
});
    
const corsOption = {
credentials: true,
origin: ['http://localhost:3000'],
};

app.use(cors(corsOption));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


mongoDb.set('strictQuery', true);
console.log("Connected to MongoDB")
mongoDb.connect(process.env.MONGO_URL).then(
).catch(err => console.error(err));





// Requests
app.post("/api/runCode/", async(req, res) => {

    const {language = "js" ,  code} = req.body;
    if(code === undefined) {
        return res.status(404).json({success:false, error:"Empty code body"});
    }
    try{
        const filePath = await generateFile(language, code);
        const output = await executeCpp(filePath)
    
        return res.json({filePath, output})

    }catch(err){
        res.status(500).json({err})
    }
})

const PORT = process.env.PORT || 3500;    

app.listen(PORT, ()=>{
    console.log("Server listening on", PORT)
})