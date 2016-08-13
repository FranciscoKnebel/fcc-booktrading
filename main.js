var express = require('express');
var dotenv = require('dotenv').load();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var favicon = require('serve-favicon');

var routes = require('./server/routes/index');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(__dirname + '/public/img/logo/favicon.ico'));
app.set("view options", {layout: false});
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + "/public/views");
app.set('view engine', 'ejs');

// passport
app.use(session({secret: process.env.SESSION_SECRET, name: "TrocaDeLivros", resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//email-verification
var nev = require('email-verification')(mongoose);
require('./server/auth/verification')(nev, process.env);

// pass passport auth for configuration
require('./server/auth/passport')(passport, mongoose, nev);

// pass routes
routes(app, __dirname, passport, process.env, nev);

var port = process.env.PORT || 3000;
var listener = app.listen(port, function () {
	console.log("Listening on port " + listener.address().port);
})
