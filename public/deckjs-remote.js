(function($, deck, undefined) {
	var $d = $(document);

	var config = {
		server: 'http://deckjs-remote.no.de',
		port: null
	}

	$[deck]('extend', 'remote', function(o){
		var options = $.extend({}, config, o || {});
		Modernizr.load({
			load: options.server + (options.port ? ':'+options.port : '') + '/socket.io/socket.io.js',
			callback: function(){
				setup(options);
			}
		});
	});

	function setup(options) {

		var socket = io.connect(options.server, {port: options.port || 80}),
			is_master = (window.location.hash.substring(1) == 'master');

		socket.on('connect', function(){
			socket.emit('join', { url: window.location.href, is_master: is_master });
		});

		if (is_master) {
			$d.bind('deck.change', function(e, prev, next){
				socket.emit('change', {current: next});
			});
		}
		else {
			socket.on('slide', function(current){
				$[deck]('go', current);
			});
		}
	}
	
})(jQuery, 'deck');