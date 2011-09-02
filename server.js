var connect = require('connect'),
	socketio = require('socket.io'),
	server = connect.createServer(),
	io,
	decks = {},
	util = {
        url: require('url')
	};

// set up server
server.use(connect.static(__dirname + '/public'));
server.listen(process.env.C9_PORT || 80);

// set up the socket
io = socketio.listen(server);

io.sockets.on('connection', function(client){
	client.on('join', function(data){
		var id = getIdFromUrl(data.url),
			deck = decks[id];
		
		if (!deck) {
			decks[id] = deck = defaultDeckState();
		}

		if (data.is_master) {
			deck.has_master = true;

			deck.viewers.forEach(function(viewer){
				viewer.emit('notify', { master: true });
			});

			client.on('change', function(data){
				deck.current = data.current;
				// notify viewers of change
				deck.viewers.forEach(function(viewer){
					viewer.emit('slide', deck.current);
				});
			});

			client.on('disconnect', function(){
				deck.has_master = false;
				deck.viewers.forEach(function(viewer){
					viewer.emit('notify', { master: false });
				});
			});
		}
		else {
			if (deck.has_master) {
				client.emit('notify', {master: true, current: deck.current});
			}

			deck.viewers.push(client);

			client.on('disconnect', function(){
				deck.viewers.forEach(function(viewer, i){
					if (viewer == client) {
						deck.viewers.splice(i, 1);
					}
				});
			});
		}
	});
});


function getIdFromUrl(url) {
	var parsed = util.url.parse(url);

	return parsed.hostname + parsed.pathname;
}

function defaultDeckState() {
	return {
		current: 0,
		viewers: [],
		has_master: false
	};
}