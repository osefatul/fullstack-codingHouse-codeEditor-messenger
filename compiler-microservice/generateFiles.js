const fs = require("fs");
const path = require("path");
const uuid = require("uuid").v4;

//__dirname: the path where the file is located.
const dirCodes  = path.join(__dirname, "codes");
const dirFile  = path.join(__dirname, "codes/");

//if codes doesn't exist just create one
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive: true});
}


//generate files so we can run them
const generateFile = async (format, code) =>{
    const jobId = uuid();
    const fileName = `${jobId}.${format}`;
    const filePath = path.join(dirCodes, fileName);
    await fs.writeFileSync(filePath,code);
    return filePath;
}


//Delete file once it is added into "code" directory and ran
fs.readdir(dirFile, (err, files) => {
    if (err) throw err;
    
    for (const file of files) {
        console.log(file + ' : File Deleted Successfully.');
        fs.unlinkSync(dirFile+file);
    }
});






module.exports = {
    generateFile
}