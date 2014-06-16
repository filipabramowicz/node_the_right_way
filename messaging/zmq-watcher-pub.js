"use strict";
const
	fs = require('fs'),
	zmq = require('zmq'),

	// create publisher endpoint
	publisher = zmq.socket('pub'),

	filename = process.argv[2];

fs.watch(filename, function() {

	// send messages to any subscribers
	publisher.send(JSON.stringify({
		type: 'changed',
		file: filename,
		timestamp: Date.now()
	}));
});

// listen on TCP port 5342
publisher.bind('tcp://*:5342', function(err){
	console.log('Listening for zmq subscribers...');
});