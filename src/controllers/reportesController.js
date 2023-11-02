const express= require('express')


function checkSession(req, res){
    if(req.session.loggedin){
        res.render('reportes/reportes.hbs')
    }else{
        res.redirect('/')
    }
}

function cantidadLibros(req, res){
    const idUsuario = req.session.userId;
    req.getConnection(function (err, conn) {
        if (err) {
            console.error(err);
        } else {
            conn.query('SELECT l.nombreLibro, ul.cantidad '+
            'FROM usuarioslibros ul '+
            'JOIN libros l ON ul.idLibro = l.idLibro '+
            'WHERE ul.idUsuario = ?', [idUsuario], function (err, result) {
                if (err) {
                    console.log('Error al buscar productos:', err);
                } else {
                    res.json(result);
                    console.log(result);
                }
            });
        }
    });
}

function ventasGenero(req, res){
    const idUsuario = req.session.userId;
    req.getConnection(function (err, conn) {
        if (err) {
            console.error(err);
        } else {
            conn.query('SELECT g.nombreGenero, SUM(lv.cantidad) AS cantidadVendida '+
            'FROM ventas v '+
            'INNER JOIN librosventas lv ON v.idVenta = lv.idVenta '+
            'INNER JOIN librosgenero lg ON lv.idLibro = lg.idLibro '+
            'INNER JOIN generos g ON lg.idGenero = g.idGenero '+
            'WHERE v.idUsuario = ? '+
           ' GROUP BY g.nombreGenero '+
            'HAVING cantidadVendida > 0', [idUsuario], function (err, result) {
                if (err) {
                    console.log('Error al buscar productos:', err);
                } else {
                    res.json(result);
                    console.log(result);
                }
            });
        }
    });
}

function ventas(req, res){
    const idUsuario = req.session.userId;
    req.getConnection(function (err, conn) {
        if (err) {
            console.error(err);
        } else {
            conn.query('SELECT v.idVenta, v.fecha, l.nombreLibro AS nombreProducto, lv.cantidad, lv.valorVenta / lv.cantidad AS precioUnitario, '+
            'SUM(lv.valorVenta) AS totalVenta '+
            'FROM ventas v '+
            'JOIN librosventas lv ON v.idVenta = lv.idVenta '+
            'JOIN libros l ON lv.idLibro = l.idLibro '+
            'WHERE v.idUsuario = ? '+
            'GROUP BY v.idVenta', [idUsuario], function (err, result) {
                if (err) {
                    console.log('Error al buscar productos:', err);
                } else {
                    res.json(result);
                    console.log(result);
                }
            });
        }
    });
}
module.exports={
    checkSession,
    cantidadLibros,
    ventasGenero,
    ventas
}