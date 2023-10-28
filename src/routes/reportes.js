const express= require('express');
const reportesController = require('../controllers/reportesController');

const router= express.Router();

router.get('/', reportesController.checkSession);

module.exports= router;