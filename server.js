
/**
 * Module dependencies.
 */
 /*Authorization*/
function authChecker(req, res, next) {
  if (req.session.email || req.path.indexOf("/Management") == -1) {
      next();
  } else {
     return res.render(__dirname + "/views/management/accessdenied", {
            title: 'Yetkiniz Yok',
            stylesheet: 'accessdenied',
            error: 'Bu sayfaya giriş yetkiniz bulunmamaktadır'
          });
  }
}
//


////Mongoose eklendi
var express = require('express'),
	mongoose= require('mongoose');
var http = require('http');
var path = require('path');
/*Mongoose bağlantısı*/
mongoose.connect("mongodb://localhost/fuatblog");
/*Tüm Schema 'lar çağrılıyor*/
require('./mongodb/model').initialize();
var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(__dirname+'/public/images/favicon.ico'));
////Cookie için eklendi.
app.use(express.cookieParser());
////Session desteği için eklendi
app.use(express.session({secret: 'asdfsdfsafasdfasdfasdf'}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
////Put ve Delete mothodları için
app.use(express.methodOverride());
////Requeestleri ayrıştırmak için kullanılıyor
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authChecker);
app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
////Helpers
//require('./apps/helpers')(app);
//Routes
require('./apps/authentication/routes')(app)
require('./apps/blog/routes')(app)
require('./apps/management/routes')(app)

// Handle 404
  app.use(function(req, res) {
      res.status(400);
     return res.render(__dirname + "/views/404",{
		});
  });
  
  // Handle 500
  app.use(function(error, req, res, next) {
      res.status(500);
     return res.render(__dirname + "/views/500",{
		});
  });
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
