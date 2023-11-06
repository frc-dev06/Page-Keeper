const express= require('express');
const ventasCotroller= require('../controllers/ventasCotroller');
const { route } = require('./login');

const router= express.Router();

router.get('/', ventasCotroller.checkSession);
router.get('/search', ventasCotroller.search);
router.post('/buy', ventasCotroller.buy);

module.exports= router