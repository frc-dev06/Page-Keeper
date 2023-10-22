const express= require('express');
const loginController= require('../controllers/loginController');
const router= express.Router();

// login
// se define metodo http, en que ruta ocurre y que va a ocurrir
router.get('/login', loginController.login);
router.post('/login', loginController.auth);
// register
router.get('/register', loginController.register);
router.post('/register', loginController.storeUser);
// logout
router.get('/logout', loginController.logout)


module.exports= router;