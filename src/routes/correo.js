const express= require('express');
const correoController = require('../controllers/correoController');

const router= express.Router();

router.get('/', correoController.checkSession);

module.exports= router;