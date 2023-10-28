const express= require('express');
const ventasCotroller= require('../controllers/ventasCotroller');

const router= express.Router();

router.get('/', ventasCotroller.checkSession);

module.exports= router