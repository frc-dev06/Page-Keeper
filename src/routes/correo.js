const express= require('express');
const correoController = require('../controllers/correoController');

const router= express.Router();

router.get('/', correoController.checkSession);
router.post('/send-email', correoController.sendEmail);

module.exports= router;