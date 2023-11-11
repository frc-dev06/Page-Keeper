const express= require('express');
const router = require('../routes/login');

const handlebars = require('handlebars');
const e = require('connect-flash');

handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

function checkSession(req, res){
    if(req.session.loggedin){
        res.render('ventas/ventas.hbs')

            


    }else{
        res.redirect('/')
    } 


}


router.get('/ventas/libros', function(req, res) {
    const idUsuario = req.session.userId;
    req.getConnection(function (err, conn) {
        if (err) {
            console.error(err);
        } else {
            conn.query('SELECT usuarioslibros.idLibro, usuarioslibros.idUsuario, libros.nombreLibro FROM usuarioslibros  JOIN libros ON usuarioslibros.idLibro = libros.idLibro where  idUsuario=? ;', [idUsuario], function (err, rows) {
                if (err) {
                    console.error(err);
                } else {
                    res.json({ libros: rows });
                    console.log(rows);
                }
            });
        }
    });
});

router.post('/ventas/comprar', function(req, res) {
    req.getConnection(function (err, conn) {
        const cantidad = req.body.cantidad; 
        const idLibro = req.body.idLibro; 
        const idUsuario = req.session.userId; 
        const date = new Date();
        let valorVenta = undefined ;

        console.log('Cantidad: ' + cantidad);
        console.log('fecha'+ date);
        console.log('Id Libro: ' + idLibro);
        console.log('Id Usuario: ' + idUsuario);

        // Consulta para obtener el valor de venta del libro
        conn.query('SELECT precio FROM usuariosLibros WHERE idLibro = ?', [idLibro], function (err, result) {
            if (err) {
                console.error(err);
            } else {
                // Check if a result was returned
                if (result.length > 0) {
                    // Get the 'precio' value from the first result
                    var precio = result[0].precio;
        
                    // Now you can use 'precio' in your calculations
                     valorVenta = precio * cantidad;
                    console.log('El resultado es: ' + valorVenta);
                } else {
                    console.log('No se encontró un libro con el id: ' + idLibro);
                }
            }
        });

        // Consulta para actualizar la cantidad de libros
        const query = 'UPDATE usuariosLibros SET cantidad =cantidad - ? WHERE idLibro = ? AND idUsuario = ?';

        // Ejecuta la consulta
        conn.query(query, [cantidad, idLibro,idUsuario], (error, results) => {
            if (error) {
                console.error('Error al actualizar la cantidad: ' + error);
                res.status(500).json({ error: 'Error al actualizar la cantidad' });
            } else {
                console.log('Cantidad actualizada con éxito: ' + JSON.stringify(results));
                res.redirect('/ventas');
            }
        });
        
        conn.query('INSERT INTO ventas (fecha, idUsuario) VALUES (NOW(), ?)', [idUsuario], function (err, result) {
            if (err) {
                console.error(err);
            } else {
                var idVenta = result.insertId;
                conn.query('INSERT INTO librosventas (cantidad, valorVenta, idVenta, idLibro) VALUES (?, ?, ?, ?)', 
                [cantidad, valorVenta, idVenta, idLibro], 
                function (err, result) {
                    if (err) {
                        console.error(err);
                    } else {
                        // Insertion successful
                    }
                });
            }
        });
    }); 
});



module.exports = {
    checkSession,
    router
};
