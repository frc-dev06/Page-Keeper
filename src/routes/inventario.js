const express= require('express');
const inventarioController = require('../controllers/inventarioController');
const router= express.Router();

router.get('/', inventarioController.checkSessionInventario);

// rutas para funciones de registro
router.get('/registrar', inventarioController.showRegistroForm);
router.post('/registrarProducto', inventarioController.registrarProducto);

// rutas para editar
router.get('/editar/:id', inventarioController.renActualizarProducto)
router.post('/editar/:id', inventarioController.actualizarProducto)

router.get('/eliminar/:id', inventarioController.renEliminarProducto)
router.get('/eliminarProducto/:id', inventarioController.eliminarProducto)

module.exports= router;