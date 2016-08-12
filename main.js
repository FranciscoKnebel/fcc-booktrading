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
var User = require('./server/models/user');
var nev = require('email-verification')(mongoose);
nev.configure({
	verificationURL: process.env.ROOT_URL + '/verify/${URL}',
	persistentUserModel: User,
	tempUserCollection: 'unverifiedUsers',

	transportOptions: {
		service: 'Gmail',
		auth: {
			user: process.env.TRANSPORTER_EMAIL,
			pass: process.env.TRANSPORTER_PASS
		}
	},
	verifyMailOptions: {
		from: 'TdL - Do Not Reply <' + process.env.TRANSPORTER_EMAIL + '>',
		subject: 'Please confirm account',
		html: '<h2>Troca de Livros</h2><hr><p>Olá! Thanks for signing up.</p><p>Click the following link to confirm your account:</p><p><a href="${URL}" target="_blank">${URL}</a></p><p>If you have not signed up at our site, you can safely ignore this e-mail.</p>',
		text: 'Please confirm your account by clicking the following link: ${URL}'
	},
	shouldSendConfirmation: true,
	confirmMailOptions: {
		from: 'TdL - Do Not Reply <' + process.env.TRANSPORTER_EMAIL + '>',
		subject: 'Successfully verified!',
		html: '<h2>Troca de Livros</h2><hr><p>Your account has been successfully verified!</p><p>Login at <a href="' + process.env.ROOT_URL + '" target="_blank">' + process.env.ROOT_URL + '</a></p>',
		text: 'Your account has been successfully verified.'
	}
}, function (result, options) {
	nev.generateTempUserModel(User, function () {});
});

// pass passport auth for configuration
require('./server/auth/passport')(passport, mongoose, nev);

// pass routes
routes(app, __dirname, passport, process.env, nev);

var port = process.env.PORT || 3000;
var listener = app.listen(port, function () {
	console.log("Listening on port " + listener.address().port);
})
