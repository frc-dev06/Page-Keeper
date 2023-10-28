const express= require('express');

function checkSession(req, res){
    if(req.session.loggedin){
        res.render('ventas/ventas.hbs')
    }else{
        res.redirect('/')
    }
}

module.exports={
    checkSession
}