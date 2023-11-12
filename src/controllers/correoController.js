const express= require('express')
const app = express();
const nodemailer = require('nodemailer');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function checkSession(req, res){
    if(req.session.loggedin){
        res.render('correo/correo.hbs')
    }else{
        res.redirect('/')
    }
}

/*
let transporter = nodemailer.createTransport({
    host: 'smtp.testmail.app',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'manuelito043@gmail.com', // your testmail username
        pass: '5WCUALD', // your testmail password
    },
});

function sendEmail(req, res) {




    if (!req.body.email) {
        console.log('No recipient email address provided');
        return res.status(400).send('No recipient email address provided');
    }
    let mailOptions = {
        from: 'manuelito043@gmail.com',
        to: 'manuelito043@gmail.com',
        subject: 'Hello',
        text: 'Hello world',
    };
    

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.redirect('/correo');
        } else {
            console.log('Email sent: ' + info.response);
            res.redirect('/correo');
        }
    });
}*/

module.exports = {
    checkSession,
    //sendEmail
};