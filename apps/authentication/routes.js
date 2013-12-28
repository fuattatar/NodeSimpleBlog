var routes = function (app) {
    ////error nesnesini null tanımlıyoruz
    app.locals.error=null;
    app.get('/Login', function (req, res) {
        return res.render(__dirname + "/views/login", {
            title: 'Giriş',
            stylesheet: 'login'
        });
    });
    ////Veritabanına bağlantı gerçekleştirildi
    //var mongoose = require('mongoose');
    //mongoose.connect("mongodb://localhost/fuatblog");
    ////User tablosu şeması oluşturuldu
    /*var UserSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        age: Number
    }),
    
    Users = mongoose.model('Users', UserSchema);*/
    var mongoose=require('mongoose');
    var Users=mongoose.model('User');
    app.post('/sessions', function (req, res) {
        /*Kullanıcıları getiren method
      Users.find({},function(err, docs){
        console.log(docs);
      });*/

        /* Yeni User oluşturuluyor */
        /*
        new Users({
        name:'fuat tatar',
        email:'fuat.tatar@hotmail.com',
        password:'123456',
        age:28
      }).save(function (err, docs){
        if(err) console.log('Kullanıcı oluşturulamadı.');
        console.log('Kullanıcı oluşturuldu');
      });
        */
        ////Kullanıcıyı filtreye göre bulan method
        console.log(req.body.login.email);
        console.log(req.body.login.password);
        console.log(req.body.login.rememberMe);
        Users.find({
            email: req.body.login.email,
            password: req.body.login.password
        }, function (err, docs) {
            if (! docs.length) {
                // no results...

                console.log('User Not Found');
                res.status(400);
                 
                 return res.render(__dirname + "/views/login", {
                        title: 'Giriş',
                        stylesheet: 'login',
                        error: 'Kullanıcı adı veya şifre yanlış'
                    });
            }
                
            console.log('User found');
            req.session.email = docs[0].email;
            console.log(req.session.email);
            return res.redirect('/Management'); 
        });
    });
};

module.exports = routes;
