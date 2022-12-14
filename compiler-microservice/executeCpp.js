const {exec} = require("child_process");
const fs = require("fs");
const path = require("path");
const { stdout, stderr } = require("process");

const outputPath = path.join(__dirname, "outputs");

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath);
}

const executeCpp = (filePath) =>{
    
    // [92569713-9d5c-41e1-be0a-7193af3e3c25, cpp]
    const jobId = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.js`);
    

    return new Promise((resolve, reject) =>{
        //execute the g++ command on filePath, and store the output in the outPath and then execute the file
        exec(
            // `g++ ${filePath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe`,
            `node "${filePath}"`,
            
            (error, stdout, stderr) =>{
                //error: a normal error that occurred
                //stderr: an error when it was processing output
                //stdout: normal output
                error && reject({ error, stderr });
                stderr && reject(stderr);
                resolve(stdout);
            }
        )
    })
}


module.exports = {
    executeCpp
}