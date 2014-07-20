var socketio = require('socket.io');
var io;
var decks = {};
var util = {
	url: require('url'),
	crypto: require('crypto')
};
var max_inactive_time = 1800000; // half-hour

module.exports = remote;
function remote (server) {
	// set up the socket
	io = socketio(server);

	io.on('connection', function(client){
		client.on('join', function(data){
			var id = getIdFromUrl(data.url),
				deck = decks[id];
			
			if (!deck) {
				decks[id] = deck = defaultDeckState(id);
			}

			deck.timestamp = Date.now();

			if (data.is_master) {
				setupMaster(client, deck);
			}
			else {
				setupViewer(client, deck);
			}
		});
	});

	setInterval(function(){
		clearInactiveSessions();
	}, max_inactive_time);

	return io;
}

function setupMaster(client, deck) {
	client.on('master', function(data){
		if (verifyKey(data.key, data.input)) {
			client.emit('master', true);
			deck.has_master = true;

			io.to(deck.id).emit('notify', { master: true });

			client.on('change', function(data){
				deck.current = data.current;
				deck.timestamp = Date.now();
				io.to(deck.id).emit('slide', deck.current);
			});

			client.on('disconnect', function(){
				deck.has_master = false;
				io.to(deck.id).emit('notify', { master: false });
			});
		}
		else {
			client.emit('master', false);
		}
			
	});
}

function setupViewer(client, deck) {
	if (deck.has_master) {
		client.emit('notify', {master: true, current: deck.current});
	}

	client.join(deck.id);
}

function getIdFromUrl(url) {
	var parsed = util.url.parse(url);
	
	return parsed.hostname + parsed.pathname;
}

function defaultDeckState(id) {
	return {
		id: id,
		current: 0,
		has_master: false
	};
}

function verifyKey(key, input) {
	return (key == util.crypto.createHash('md5').update(input).digest('hex'));
}

function clearInactiveSessions() {
	var now = Date.now();
	for (var key in decks) {
		if (now - decks[key].timestamp > max_inactive_time) {
			delete decks[key];
		}
	}
}