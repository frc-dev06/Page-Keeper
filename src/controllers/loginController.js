const bcrypt = require('bcrypt');

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
                            req.session.loggedin= true;
                            req.session.name= element.name
                            res.redirect('/');
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
                            req.session.name= data.name;
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
    login: login,
    register: register,
    storeUser,
    auth,
    logout
}