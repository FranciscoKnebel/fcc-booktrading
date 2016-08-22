var express = require('express');
var dotenv = require('dotenv').load();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var morgan = require('morgan');
var passport = require('passport');
var session = require('express-session');
var favicon = require('serve-favicon');
var helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);

var routes = require('./server/routes/index');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

var app = express();
app.use(helmet());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(__dirname + '/public/img/logo/favicon.ico'));
app.set("view options", {layout: false});
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + "/public/views");
app.set('view engine', 'ejs');

if (app.get('env') === 'production') {
	app.use(morgan('tiny'));
} else {
	app.use(morgan('dev'));
}

// passport
const connection = mongoose.createConnection(process.env.MONGODB_URI);
app.use(session({
	secret: process.env.SESSION_SECRET,
	name: "TrocaDeLivros",
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//email-verification
var nev = require('email-verification')(mongoose);
require('./server/auth/verification')(nev);

// pass passport auth for configuration
require('./server/auth/passport')(passport, mongoose, nev);

// pass routes
routes(app, __dirname, passport, process.env, nev);

var port = process.env.PORT || 3000;
var listener = app.listen(port, function () {
	console.log("Listening on port " + listener.address().port);
});
