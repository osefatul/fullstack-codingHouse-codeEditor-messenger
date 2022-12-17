require('dotenv').config();


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nodejsdev007@gmail.com",
        pass:"geweyagctezizybt"
        // user: process.env.NODEMAILER_ADDRESS,
        // pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})


const send = (info) => {
    return new Promise(async (resolve, reject) => {
    try {
        let result = await transporter.sendMail(info);
        console.log("Message sent: %s", result.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
        resolve(result);
    } catch (error) {
        console.log(error);
    }
    });
};



const emailProcessor = ({ email, pin, type, otp }) => {
    let info = "";
    switch (type) {
    case "request-new-password":
        info = {
          from: '"Coding House" <nodejsdev007@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Password rest Pin", // Subject line
        text:
            "Here is your password rest pin" +
            pin +
            " This pin will expires in 1day", // plain text body
        html: `<b>Hello </b>
        Here is your pin 
        <b>${pin} </b>
        This pin will expires in 1day
        <p></p>`, // html body
        };

        send(info);
        break;

    case "update-password-success":
        info = {
          from: '"Coding House" <nodejsdev007@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Password updated", // Subject line
          text: "Your new password has been update", // plain text body
        html: `<b>Hello </b>
        
        <p>Your new password has been update</p>`, // html body
        };

        send(info);
        break;

    case "new-user-confirmation-required":
        info = {
        from: '"Coding House" <nodejsdev007@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Please Enter OTP", // Subject line
        text:
            "Please Enter the OTP.", // plain text body
        html: `<b>Hello </b>
        <p>Please Enter the OTP.</p>
        <p>${otp}</P>
          `, // html body
        };

        send(info);
        break;

    default:
        break;
    }
};





module.exports = { emailProcessor };