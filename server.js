var http = require('http');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var remote = require('./remote');
var serve;
var server;

// set up server
serve = serveStatic(__dirname + '/public', {
	setHeaders: function(res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
	}
});
server = http.createServer(function (req, res) {
	var done = finalhandler(req, res);
	serve(req, res, done);
});
server.listen(process.env.C9_PORT || process.argv[2] || 80, function(err) {
	if (err) {
		throw err;
	}
	console.log('deckjs-remote server listening on %s', server.address().port);
});

remote(server);

module.exports = server;