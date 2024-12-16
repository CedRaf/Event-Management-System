const nodemailer = require('nodemailer');
require("dotenv").config(); 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
});

const sendEmail = (to, subject, link)=>{
    const email = {
        from: process.env.USER_EMAIL,
        to: to,
        subject: subject,
        text: `Click the link to reset your password NOTE: This is only valid for 30 minutes ${link}`
    }

    return transporter.sendMail(email)
}

module.exports = sendEmail