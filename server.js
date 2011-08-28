var connect = require('connect'),
	socketio = require('socket.io'),
	server = connect.createServer(),
	io,
	deck = {
		current: 0
	};

// set up server
server.use(connect.static(__dirname + '/public'));
server.listen(80);

// set up the socket
io = socketio.listen(server);

io.sockets.on('connection', function(client){
	client.emit('slide', deck);
	client.on('change', function(data){
		deck.current = data.current;
		io.sockets.emit('slide', deck);
	});
});