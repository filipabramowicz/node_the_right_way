'use strict';
const
    express = require('express'),
    app = express(),
    logger = require('morgan'),
  	session = require('express-session'),
	redisClient = require('redis').createClient(),
	RedisStore = require('connect-redis')(session),
	cookieParser = require('cookie-parser'),
	passport = require('passport');
	GoogleStrategy = require('passport-google').Strategy;

passport.serializeUser(function(user, done){
	done(null, user.identifier);
});

passport.deserializeUser(function(id, done){
	done(null, { identifier: id });
});
passport.use(new GoogleStrategy({
		returnURL: 'http://localhost:3000/auth/google/return',
		realm: 'http://localhost:3000/'
	},
	function(identifier, profile, done) {
		profile.identifier = identifier;
		return done(null, profile);
	}
));


app.use(cookieParser('unguessable'));
app.use(session({ store: new RedisStore({ client: redisClient }), secret: 'unguessable'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/bower_components'));

const config = {
	bookdb: 'http://localhost:5984/books/',
	b4db: 'http://localhost:5984/b4/'
};

require('./lib/field-search.js')(config, app);
require('./lib/book-search.js')(config, app);
require('./lib/bundle.js')(config, app);

app.get('/auth/google/:return?',
	passport.authenticate('google', { successRedirect: '/' })
);

app.get('/auth/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/api/:name', function(req,res){
	res.json(200, { "hello": req.params.name});
});

app.listen(3000, function(){
  console.log("ready captain.");
});