'use strict';
const
	express = require('express'),
	app = express(),
	logger = require('morgan');

app.use(logger('dev'));
app.get('/api/:name', function(req,res){
	res.json(200, { "hello": req.params.name});
});
app.listen(3000, function() {
	console.log('Ready Captain!');
})