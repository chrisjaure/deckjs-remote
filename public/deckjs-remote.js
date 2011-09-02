(function($, deck, undefined) {
	var $d = $(document),
		config = {
			server: 'http://deckjs-remote.no.de',
			port: null
		},
		joined = false,
		current_slide = 0,
		UI;

	$[deck]('extend', 'remote', function(o){
		var options = $.extend({}, config, o || {});
		Modernizr.load({
			load: options.server + (options.port ? ':'+options.port : '') + '/socket.io/socket.io.js',
			callback: function(){
				setup(options);
			}
		});
	});

	UI = {
		create: function(){
			this.joinMessage = $('.deck-remote-join-message');
			this.leaveMessage = $('.deck-remote-leave-message');

			// join link
			this.joinMessage.find('.deck-remote-join-link')
				.click($.proxy(function(e){
					e.preventDefault();
					joined = true;
					$[deck]('go', current_slide);
					this.hideMessages();
				}, this));

			// ignore link, close link
			this.joinMessage.find('.deck-remote-ignore-link')
				.add(this.leaveMessage.find('.deck-remote-close-link'))
				.click($.proxy(function(e){
					e.preventDefault();
					this.hideMessages();
				}, this));

			this.hideMessages();
		},

		showMessage: function(message) {
			this.hideMessages();
			message.css({
				visibility: 'visible',
				top: 0
			});
		},

		showJoinMessage: function(){
			this.showMessage(this.joinMessage);
		},

		showLeaveMessage: function(){
			this.showMessage(this.leaveMessage);
		},

		hideMessages: function(){
			this.joinMessage.add(this.leaveMessage)
				.css('top', -this.joinMessage.outerHeight() - 40);
		}
	};

	function setup(options) {

		var socket = io.connect(options.server, {port: options.port || 80}),
			is_master = (window.location.hash.substring(1) == 'master');

		UI.create();

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
				if (joined) {
					$[deck]('go', current);
				}
				current_slide = current;
			}).on('notify', function(data){
				if (data.master && !joined) {
					UI.showJoinMessage();
				}
				else if (joined) {
					UI.showLeaveMessage();
				}

				if (data.current) {
					current_slide = data.current;
				}
			});
		}
	}
})(jQuery, 'deck');