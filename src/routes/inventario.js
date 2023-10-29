const express= require('express');
const inventarioController = require('../controllers/inventarioController');
const router= express.Router();

router.get('/', inventarioController.checkSession);

// rutas para funciones de registro
router.get('/registrar', inventarioController.showRegistroForm);
router.post('/registrarProducto', inventarioController.registrarProducto);


module.exports= router;