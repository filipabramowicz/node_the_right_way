'use strict';
const
	express = require('express'),
	app = express(),
	session = require('express-session'),
	redisClient = require('redis').createClient(),
	RedisStore = require('connect-redis')(session),
	logger = require('morgan'),
	cookieParser = require('cookie-parser');

app.use(cookieParser('unguessable'));
app.use(session({ store: new RedisStore({ client: redisClient }), secret: 'unguessable'}));
app.use(logger('dev'));

app.get('/api/:name', function(req,res){
	res.json(200, { "hello": req.params.name});
});

app.listen(3000, function() {
	console.log('Ready Captain!');
})