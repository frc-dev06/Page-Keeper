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

        // Consulta para obtener el valor de cantidad del libro
        conn.query('SELECT cantidad FROM usuariosLibros WHERE idLibro = ?', [idLibro], function (err, result) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error al realizar la consulta de cantidad.' });
            } else {
                // Verifica si se devolvió un resultado
                if (result.length > 0) {
                    // Obtiene el valor de 'cantidad' del primer resultado
                    var cantidadDB = result[0].cantidad;

                    // Verifica si la cantidad ingresada es mayor que la cantidad de la base de datos
                    if (cantidad > cantidadDB) {
                        console.log('La cantidad ingresada es mayor que la cantidad disponible. No se puede realizar la venta.');
                        return res.status(400).json({ error: 'La cantidad ingresada es mayor que la cantidad disponible. No se puede realizar la venta.' });
                    }

                    // Ahora puedes usar 'cantidad' en tus cálculos
                    console.log('El resultado es: ' + cantidadDB);

                    // Consulta para obtener el valor de venta del libro
                    conn.query('SELECT precio FROM usuariosLibros WHERE idLibro = ?', [idLibro], function (err, result) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ error: 'Error al realizar la consulta de precio.' });
                        } else {
                            // Check if a result was returned
                            if (result.length > 0) {
                                // Get the 'precio' value from the first result
                                var precio = result[0].precio;
                    
                                // Now you can use 'precio' in your calculations
                                valorVenta = precio * cantidad;
                                console.log('El resultado es: ' + valorVenta);

                                // Consulta para actualizar la cantidad de libros
                                const query = 'UPDATE usuariosLibros SET cantidad =cantidad - ? WHERE idLibro = ? AND idUsuario = ?';

                                // Ejecuta la consulta
                                conn.query(query, [cantidad, idLibro,idUsuario], (error, results) => {
                                    if (error) {
                                        console.error('Error al actualizar la cantidad: ' + error);
                                        return res.status(500).json({ error: 'Error al actualizar la cantidad.' });
                                    } else {
                                        console.log('Cantidad actualizada con éxito: ' + JSON.stringify(results));

                                        // Resto del código...
                                        conn.query('INSERT INTO ventas (fecha, idUsuario) VALUES (NOW(), ?)', [idUsuario], function (err, result) {
                                            if (err) {
                                                console.error(err);
                                                return res.status(500).json({ error: 'Error al realizar la inserción en ventas.' });
                                            } else {
                                                var idVenta = result.insertId;
                                                conn.query('INSERT INTO librosventas (cantidad, valorVenta, idVenta, idLibro) VALUES (?, ?, ?, ?)', 
                                                [cantidad, valorVenta, idVenta, idLibro], 
                                                function (err, result) {
                                                    if (err) {
                                                        console.error(err);
                                                        return res.status(500).json({ error: 'Error al realizar la inserción en librosventas.' });
                                                    } else {
                                                        // Insertion successful
                                                        res.redirect('/ventas');
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log('No se encontró un libro con el id: ' + idLibro);
                                return res.status(404).json({ error: 'No se encontró un libro con el id proporcionado.' });
                            }
                        }
                    });
                } else {
                    console.log('No se encontró un libro con el id: ' + idLibro);
                    return res.status(404).json({ error: 'No se encontró un libro con el id proporcionado.' });
                }
            }
        });
    });
});

router.get('/ventas/consultas', function(req, res) {
    const idUsuario = req.session.userId;
    req.getConnection(function (err, conn) {
        if (err) {
            console.error(err);
        } else {
            const query = `
                SELECT ventas.idVenta AS idVenta, libros.nombreLibro, ventas.fecha, librosventas.cantidad, librosventas.valorVenta AS valorVenta
                FROM librosventas
                JOIN ventas ON librosventas.idVenta = ventas.idVenta
                JOIN libros ON librosventas.idLibro = libros.idLibro
                WHERE ventas.idUsuario = ?;
            `;
            console.log(query);
            conn.query(query, [idUsuario], function (err, rows) {
                if (err) {
                    console.error(err);
                } else {
                    if (rows) {
                        console.log(rows);
                        res.json({ ventas: rows });
                    } else {
                        console.log('No se encontraron ventas para el usuario: ' + idUsuario);
                        res.json({ ventas: [] });
                    }
                }
            });
        }
    });
});

module.exports = {
    checkSession,
    router
};
