"use strict";
const
	zmq = require('zmq'),
	filename = process.argv[2],

	// creat request endpoint
	requester = zmq.socket('req');

// handle replies from responder
requester.on('message', function(data){
	let response = JSON.parse(data);
	console.log('Received response: ', response);
});

requester.connect('tcp://127.0.0.1:5342');

// send request for content
for (let i=1; i<=3; i++) {
	console.log('Sending request ' + i +' for ' + filename);
	requester.send(JSON.stringify({
		path: filename
	}));
}