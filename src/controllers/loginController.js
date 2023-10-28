const bcrypt = require('bcrypt');
let idUsuario= undefined;
let nameUsuario= undefined;
let emailUsuario= undefined;


function login(req, res) {
    if(req.session.loggedin != true){
        res.render('login/index');
    }else{
        res.redirect('/')
    }
}
// verificar contraseña e inicio de sesion
function auth(req, res){
    const data= req.body;
    
    req.getConnection((err, conn) => {
        //                                                               array de objetos
        conn.query('SELECT * FROM usuarios WHERE email = ?', [data.email], (err, userdata) => {
            
            if (userdata.length > 0) {

                userdata.forEach(element => {
                bcrypt.compare(data.password, element.password, (err, isMatch)=>{
                
                        if(!isMatch){
                            console.log();
                            res.render('login/index', {error: 'Error: incorrect password'})
                            
                        }else{
                            console.log('welcome');
                            // confirmar que hay una sesion activa
                            req.session.loggedin= true;
                            // almacenar el id de usuario de la DB
                            req.session.userId= element.idUsuario;
                            idUsuario= req.session.userId
                            // almacenar nombre de usuario
                            req.session.userName= element.name
                            nameUsuario= req.session.userName
                            // almacenar email de usuario
                            req.session.userEmail= element.email
                            emailUsuario= req.session.userEmail
                            res.redirect('/');
                            console.log({emailUsuario,idUsuario,nameUsuario});
                        }
                    });
                    
                })
            } else {
                res.render('login/index', {error: 'Error: user not exists'})
            }
        });
    });
}

function register(req, res) {
    if(req.session.loggedin != true){
        res.render('login/register');
    }else{
        res.redirect('/')
    }
}

// extraer los datos de la solicitud
function storeUser(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        // validar si ya existe un usuaario con el mismo email
        conn.query('SELECT * FROM usuarios WHERE email = ?', [data.email], (err, userdata) => {
            if (userdata.length > 0) {
                res.render('login/register', {error: 'Error: user alredy exists'})
            } else {
                // encriptar contraseña 
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;

                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO usuarios SET ?', [data], (err, rows) => {
                            req.session.loggedin= true;
                            req.session.name= data.userName;
                            res.redirect('/');
                        });
                    });
                });
            }
        });
    })
};

function logout(req, res){
    if(req.session.loggedin==true){
        // cerrar la sesion 
        req.session.destroy();
    }
    res.redirect('/login')
    
}

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
    idUsuario,
    nameUsuario,
    emailUsuario
}