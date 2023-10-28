const express= require('express')


function checkSession(req, res){
    if(req.session.loggedin){
        res.render('inventario/inventario.hbs')
    }else{
        res.redirect('/')
    }
}

module.exports={
    checkSession
}