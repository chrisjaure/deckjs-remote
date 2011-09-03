(function($, deck, undefined) {
	var $d = $(document),
		config = {
			server: 'http://deckjs-remote.no.de',
			port: null
		},
		joined = false,
		current_slide = 0,
		key = 'eb0a191797624dd3a48fa681d3061212',
		socket,
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
			this.masterMessage = $('.deck-remote-master-message');
			this.hideMessages();

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
			
			// master join form
			this.masterMessage.find('.deck-remote-master-form')
				.submit($.proxy(function(e){
					e.preventDefault();
					socket.emit('master', {
						key: key,
						input: $('.deck-remote-password').val()
					});
				}, this));
			
			// master password
			$('.deck-remote-password').keydown(function(e){
				e.stopPropagation();
			});
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

		showMasterMessage: function(){
			this.showMessage(this.masterMessage);
		},

		showMasterFeedback: function(message){
			this.masterMessage.find('.deck-remote-master-feedback')
				.text(message)
				.show();
		},

		hideMessages: function(){
			this.joinMessage
				.add(this.leaveMessage)
				.add(this.masterMessage)
				.each(function(){
					$(this).css('top', -$(this).outerHeight() - 40);
				});
		}
	};

	function setup(options) {

		var is_master = (window.location.search.search(/\bmaster\b/) != -1);

		key = options.key || key;
		socket = io.connect(options.server, {port: options.port || 80});

		UI.create();
		
		socket.on('connect', function(){
			socket.emit('join', { url: window.location.href, is_master: is_master });
		});

		if (is_master) {
			UI.showMasterMessage();
			socket.on('master', function(success){
				if (success) {
					$d.bind('deck.change', function(e, prev, next){
						socket.emit('change', {current: next});
					});
					UI.showMasterFeedback('Session started!');
					setTimeout(function(){
						UI.hideMessages();
					}, 3000);
				}
				else {
					UI.showMasterFeedback('Wrong password!');
				}
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