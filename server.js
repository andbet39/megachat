// server.js

var express        = require('express');
var mongoose      = require('mongoose');
var app            = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var httpServer = require("http").createServer(app);
var cors = require('cors');




// config files
var db = require('./config/db');

// set our port
var port = 3000;

// connect to  mongoDB  
mongoose.connect(db.url);

// parse application/json 
app.use(bodyParser.json());

// parse application/vnd.api+json as json
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));


app.use(express.static(__dirname + '/public'));

app.use(cors());


//var chat =  require('./chatServer.js')(httpServer);
var auth = require('./server/routes/auth.js')(app);
//var location = require('./server/routes/location.js')(app,httpServer);



httpServer.listen(port);



// expose app           
exports = module.exports = app;


