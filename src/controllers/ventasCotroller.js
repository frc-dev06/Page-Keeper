const express= require('express');
const router = require('../routes/login');
const controller = {};

function checkSession(req, res){
    if(req.session.loggedin){
        res.render('ventas/ventas.hbs')
    }else{
        res.redirect('/')
    } 
}

const search = (req, res) => {
    controller.search = (req, res) => {
        const searchTerm = req.params.busqueda;
        req.connection.query('select libros.nombreLibro, usuarioslibros.cantidad, usuarioslibros.precio from libros join usuarioslibros on libros.idLibro=usuarioslibros.idLibro nombre LIKE ?', ['%' + searchTerm + '%'], (err, results) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json(results);
            }
        });
    }
    
};

const buy = (req, res) => {
    controller.buy = (req, res) => {
        const productId = req.body.productId;
        const quantity = req.body.quantity;
    
        // Primero, verifica si hay suficientes productos en stock
        req.connection.query('SELECT idUsuariosLibros, cantidad from usuarioslibros where idUsuariosLibros=?', [productId], (err, results) => {
            if (err) {
                res.status(500).json(err);
            } else if (results[0].stock < quantity) {
                res.status(400).json({message: 'No hay suficientes productos en stock'});
            } else {
                // Si hay suficientes productos en stock, realiza la compra
                req.connection.query('UPDATE usuarioslibros SET cantidad = cantidad - ? WHERE idUsuariosLibros = ?', [quantity, productId], (err, results) => {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.json({message: 'Compra realizada con éxito'});
                    }
                });
            }
        });
    }
};



module.exports={
    checkSession,
    search,
    buy
}