const express= require('express')
const nodemailer = require('nodemailer');



function checkSession(req, res){
    if(req.session.loggedin){
        res.render('correo/correo.hbs')
    }else{
        res.redirect('/')
    }
}

const sendEmail = (req, res) => {
    const { email, subject, message, file } = req.body;

    // Configura tu transporte de correo aquí
    let transporter = nodemailer.createTransport({
        // Tus configuraciones de transporte
    });

    // Configura tu correo aquí
    let mailOptions = {
        from: 'tu-correo@gmail.com',
        to: email,
        subject: subject,
        text: message,
        attachments: [
            {
                path: file // Asegúrate de manejar la carga de archivos correctamente
            }
        ]
    };

    // Envía el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('error');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('success');
        }
    });
};

module.exports = {
    checkSession,
    sendEmail
}