const express = require('express')

function buscarProducto(req, res) {
    const inputVal = req.params.busqueda; // Obtén el término de búsqueda desde la URL
    const idUsuario = req.session.userId;

    // Modifica el término de búsqueda con comodines %
    const searchTermValue = `%${inputVal}%`;

    // Realiza una consulta a la base de datos para buscar productos basados en searchTerm y el id del usuario
    req.getConnection(function (err, conn) {
        if (err) {
            console.error(err);
        } else {
            conn.query('SELECT ul.idUsuariosLibros, l.nombreLibro AS nombre, ul.precio, ul.cantidad, (SELECT nombreAutor FROM autores a WHERE a.idAutor = (SELECT idAutor FROM librosAutores la WHERE la.idLibro = l.idLibro LIMIT 1)) AS autor, g.nombreGenero AS genero FROM libros l JOIN usuariosLibros ul ON l.idLibro = ul.idLibro JOIN librosGenero lg ON l.idLibro = lg.idLibro JOIN generos g ON lg.idGenero = g.idGenero WHERE ul.idUsuario = ? AND l.nombreLibro LIKE ?', [idUsuario, searchTermValue], function (err, productos) {
                if (err) {
                    console.log('Error al buscar productos:', err);
                } else {
                    // Renderiza la vista de inventario con los resultados de la búsqueda
                    const respuestaJSON = { productos };
                    res.json(respuestaJSON);
                }
            });
        }
    });
}



function checkSessionInventario(req, res) {
    if (req.session.loggedin) {

        const idUsuario = req.session.userId;
        req.getConnection(function (err, conn) {
            if (err) {
                // Manejar errores si es necesario
                console.error(err);
            } else {
                // consulta a la base de datos
                conn.query('SELECT ' +
                    ' l.idLibro, ' +
                    ' ul.idUsuariosLibros,' +
                    '  l.nombreLibro AS nombre, ' +
                    '  ul.precio, ' +
                    '  ul.cantidad, ' +
                    '  (SELECT nombreAutor FROM autores a WHERE a.idAutor = (SELECT idAutor FROM librosAutores la WHERE la.idLibro = l.idLibro LIMIT 1)) AS autor, ' +
                    '  g.nombreGenero AS genero ' +
                    'FROM ' +
                    '  libros l ' +
                    '  JOIN usuariosLibros ul ON l.idLibro = ul.idLibro ' +
                    '  JOIN librosGenero lg ON l.idLibro = lg.idLibro ' +
                    '  JOIN generos g ON lg.idGenero = g.idGenero ' +
                    'WHERE ul.idUsuario = ?', [idUsuario], function (err, productos) {
                        if (err) {
                            console.log('Error: ' + err);
                        } else {
                            // Renderiza la vista con los datos de los géneros
                            res.render('inventario/inventario.hbs', { productos });
                            console.log('Render inventarios OK');
                            console.log(productos);
                        }
                    });
            }
        });
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

    if (req.session.loggedin) {
        const idUsuario = req.session.userId;
        const idGenero = data.genero;
        let idLibro = undefined;
        let idAutor = undefined;

        req.getConnection(function (err, conn) {
            if (err) {
                console.error(err);
            } else {
                // Comprobar si el autor ya existe en la tabla autores
                conn.query('SELECT idAutor FROM autores WHERE nombreAutor = ?', [data.autor], function (err, rows) {
                    if (err) {
                        console.error(err);
                    } else {
                        if (rows.length > 0) {
                            // El autor ya existe, obtener su id
                            idAutor = rows[0].idAutor;
                            insertarLibro();
                        } else {
                            // El autor no existe, insertarlo en la tabla autores
                            conn.query('INSERT INTO autores (nombreAutor) VALUES (?)', [data.autor], function (err, result) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    // Obtener el id del autor recién insertado
                                    idAutor = result.insertId;
                                    insertarLibro();
                                }
                            });
                        }
                    }
                });

                function insertarLibro() {
                    // Insertar el libro en la tabla libros
                    conn.query('INSERT INTO libros (nombreLibro) VALUES (?)', [data.nombre], function (err, result) {
                        if (err) {
                            console.error(err);
                        } else {
                            // Obtener el id del libro recién insertado
                            idLibro = result.insertId;

                            // Insertar registros en las tablas relacionadas
                            conn.query('INSERT INTO usuariosLibros (precio, idUsuario, idLibro, cantidad) VALUES (?, ?, ?, ?)', [data.precio, idUsuario, idLibro, data.cantidad], function (err) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    // Inserción exitosa en usuariosLibros

                                    // Insertar el registro en librosGenero
                                    conn.query('INSERT INTO librosGenero (idGenero, idLibro) VALUES (?, ?)', [idGenero, idLibro], function (err) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            // Inserción exitosa en librosGenero

                                            // Insertar el registro en librosAutores
                                            conn.query('INSERT INTO librosAutores (idLibro, idAutor) VALUES (?, ?)', [idLibro, idAutor], function (err) {
                                                if (err) {
                                                    console.error(err);
                                                } else {
                                                    // Inserción exitosa en librosAutores
                                                    res.redirect('/inventario');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        console.log('No hay sesión.');
    }
}

function renActualizarProducto(req, res) {
    const idUsuariosLibros = req.params.id;
    const idUsuario = req.session.userId;

    if (req.session.loggedin) {
        req.getConnection(function (err, conn) {
            if (err) {
                // Manejar errores si es necesario
                console.error(err);
            } else {
                // consulta a la base de datos para obtener los datos del producto
                conn.query('SELECT ' +
                    ' ul.idUsuariosLibros,' +
                    '  l.nombreLibro AS nombre, ' +
                    '  ul.precio, ' +
                    '  ul.cantidad, ' +
                    '  (SELECT nombreAutor FROM autores a WHERE a.idAutor = (SELECT idAutor FROM librosAutores la WHERE la.idLibro = l.idLibro LIMIT 1)) AS autor, ' +
                    '  g.nombreGenero AS genero ' +
                    'FROM ' +
                    '  libros l ' +
                    '  JOIN usuariosLibros ul ON l.idLibro = ul.idLibro ' +
                    '  JOIN librosGenero lg ON l.idLibro = lg.idLibro ' +
                    '  JOIN generos g ON lg.idGenero = g.idGenero ' +
                    'WHERE ul.idUsuario = ? AND ul.idUsuariosLibros = ?', [idUsuario, idUsuariosLibros], function (err, producto) {
                        if (err) {
                            console.log('Error: ' + err);
                        }
                        // Consultar los géneros
                        conn.query('SELECT * FROM generos', function (err, generos) {
                            if (err) {
                                console.log('Error: ' + err);
                            }
                            // Renderizar la vista con los datos de los géneros y el producto
                            res.render('inventario/actualizar.hbs', { generos, producto });

                        });
                    });
            }
        });
    } else {
        res.redirect('/');
    }
}

function actualizarProducto(req, res) {
    const data = req.body;
    const idUsuariosLibros = req.params.id;
    const idUsuario = req.session.userId;

    if (req.session.loggedin) {
        req.getConnection(function (err, conn) {
            if (err) {
                console.error(err);
            } else {
                // Busca el idAutor a partir del nombre del autor
                conn.query('SELECT idAutor FROM autores WHERE nombreAutor = ?', [data.autor], function (err, rows) {
                    if (err) {
                        console.error(err);
                    } else {
                        if (rows.length > 0) {
                            // Se encontró el idAutor
                            const idAutor = rows[0].idAutor;
                            // Actualiza el libro en la tabla libros
                            conn.query('UPDATE libros SET nombreLibro = ? WHERE idLibro = (SELECT idLibro FROM usuariosLibros WHERE idUsuariosLibros = ? AND idUsuario = ?)',
                                [data.nombre, idUsuariosLibros, idUsuario],
                                function (err) {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        // Actualiza el registro en usuariosLibros
                                        conn.query('UPDATE usuariosLibros SET precio = ?, cantidad = ? WHERE idUsuariosLibros = ? AND idUsuario = ?',
                                            [data.precio, data.cantidad, idUsuariosLibros, idUsuario],
                                            function (err) {
                                                if (err) {
                                                    console.error(err);
                                                } else {
                                                    // Actualiza el registro en librosGenero
                                                    conn.query('UPDATE librosGenero SET idGenero = ? WHERE idLibro = (SELECT idLibro FROM usuariosLibros WHERE idUsuariosLibros = ? AND idUsuario = ?)',
                                                        [data.genero, idUsuariosLibros, idUsuario],
                                                        function (err) {
                                                            if (err) {
                                                                console.error(err);
                                                            } else {
                                                                // Actualiza el registro en librosAutores con el idAutor correcto
                                                                conn.query('UPDATE librosAutores SET idAutor = ? WHERE idLibro = (SELECT idLibro FROM usuariosLibros WHERE idUsuariosLibros = ? AND idUsuario = ?)',
                                                                    [idAutor, idUsuariosLibros, idUsuario],
                                                                    function (err) {
                                                                        if (err) {
                                                                            console.error(err);
                                                                        } else {
                                                                            res.redirect('/inventario');
                                                                            console.log('actualizacion exitoza');
                                                                        }
                                                                    });
                                                            }
                                                        });
                                                }
                                            });
                                    }
                                });
                        } else {
                            console.error("El autor no se encontró en la base de datos.");
                            // Manejar el caso en el que el autor no existe
                            res.redirect('/inventario');  // Por ejemplo, redirigir a la página de inventario
                        }
                    }
                });
            }
        });
    } else {
        console.log('No hay sesión.');
    }
}

function renEliminarProducto(req, res) {
    if (req.session.loggedin) {

        const idUL = req.params.id
        req.getConnection(function (err, conn) {
            if (err) {
                // Manejar errores si es necesario
                console.error(err);
            } else {
                // consulta a la base de datos

                res.render('inventario/eliminar.hbs', { idUL });


            }
        });
    } else {
        res.redirect('/');
    }
}
function eliminarProducto(req, res) {

    if (req.session.loggedin) {
        const idUsuario = req.session.userId;
        const idUL = req.params.id
        req.getConnection(function (err, conn) {

            if (err) {
                // Manejar errores si es necesario
                console.error(err);
            } else {
                // consulta a la base de datos
                conn.query('DELETE FROM usuariosLibros WHERE idUsuariosLibros=?', [idUL], function (err) {
                    if (err) {
                        console.log('Error: ' + err);
                    }
                    // Renderiza la vista con los datos de los géneros
                    res.redirect('/inventario');
                    console.log('libro eliminado');
                });
            }
        })
        console.log(idUL);


    } else {
        console.log('no hay sesion');
    }
}


module.exports = {
    buscarProducto,
    checkSessionInventario,
    showRegistroForm,
    registrarProducto,
    renActualizarProducto,
    actualizarProducto,
    renEliminarProducto,
    eliminarProducto
};