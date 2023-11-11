const express= require('express');
const ventasController = require('../controllers/ventasController');
const router= express.Router();

router.get('/', ventasController.checkSession);


module.exports= router;