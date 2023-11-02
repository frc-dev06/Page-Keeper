const express= require('express');
const reportesController = require('../controllers/reportesController');
const router= express.Router();



router.get('/', reportesController.checkSession);

// reporte cantidad de libros
router.get('/librosCantidad', reportesController.cantidadLibros)

router.get('/ventasGenero', reportesController.ventasGenero)

router.get('/ventas', reportesController.ventas)
module.exports= router;