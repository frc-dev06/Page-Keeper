const express = require('express')
const loginController= require('./loginController');


function checkSession(req, res) {
    if (req.session.loggedin) {
        res.render('inventario/inventario.hbs')
    } else {
        res.redirect('/')
    }
}

// mostrar formulario de registro de producto
function showRegistroForm(req, res) {
    if (req.session.loggedin) {
        req.getConnection(function (err, conn) {
            if (err) {
                // Manejar errores si es necesario
                console.error(err);
            } else {
                // consulta a la base de datos
                conn.query('SELECT * FROM generos', function (err, generos) {
                    if (err) {
                        console.log('Error: ' + err);
                    }

                    // Renderiza la vista con los datos de los géneros
                    res.render('inventario/registroProducto.hbs', { generos });
                });
            }
        });
    } else {
        res.redirect('/');
    }
}

function registrarProducto(req, res) {
    const data = req.body;
    console.log(data);

    if (req.session.loggedin) {
        const idUsuario = req.session.userId;
        const idGenero= data.genero;
        let idLibro= undefined;
        req.getConnection(function (err, conn) {
            if (err) {
                console.error(err);
            } else {
                // insertar libro en tabla libros
                conn.query('INSERT INTO libros (nombreLibro) VALUES (?)', [data.nombre], function (err, result) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('Registro exitoso en tabla libros.');
                        // obtener id del registro
                        idLibro= result.insertId;
                        console.log(idLibro);

                        conn.query('INSERT INTO usuariosLibros (precio, idUsuario, idLibro, cantidad) VALUES (?, ?, ?, ?)', [data.precio, idUsuario, idLibro, data.cantidad], function(err, result) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log('Registro exitoso en tabla librosUsuarios');
                                // insercion de librosGeneros
                                conn.query('INSERT INTO librosGenero (idGenero, idLibro) VALUES (?, ?)', [idGenero, idLibro], function(err, result) {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        console.log('Registro exitoso en tabla librosGenero');
                                    }
                                });

                            }
                        });
                    }
                });
            }
        });
    } else {
        console.log('No hay sesión.');
    }
}


module.exports = {
    checkSession,
    showRegistroForm,
    registrarProducto

}