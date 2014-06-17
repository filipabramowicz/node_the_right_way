'use strict';
const
	request = require('request'),
	async = require('async'),
	file = require('file'),
	rdfParser = require('./lib/rdf-parser.js'),

	work = async.queue(function(path, done){
		rdfParser(path, function(err,doc) {
			request({
				method: 'PUT',
				url: 'http://127.0.0.1:5984/books/' + doc._id,
				json: doc
			}, function (err, res, body){
				if (err) {
					throw Error(err);
				}
				console.log(res.statusCode, body);
				done();
			});
		});
	}, 10);

console.log('Begining directory walk');
file.walk(__dirname + '/cache', function(err, dirPath, dirs, files) {
	files.forEach(function(path){
		work.push(path);
	});
});