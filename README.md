# deck.js remote

This is a remote control plugin for [deck.js](http://imakewebthings.github.com/deck.js/)

## Installation

You can use the service running at http://deckjs-remote.no.de

	<script src="http://deckjs-remote.no.de/deckjs-remote.js"></script>
	<script>
		$(function(){
			$.deck('.slide');
			$.deck('remote', {
				//server: 'http://deckjs-remote.no.de',
				//port: 80
			})
		});
	</script>

Or host it yourself.

## Usage

To set up the remote, go to your slide url and add the hash #master to the url, e.g. http://imakewebthings.github.com/deck.js/#master

Controlling this deck will control all others currently being viewed.

## TODO

Lots of stuff. It's useless as a service right now since only one slideshow can be controlled at once, but it should be handy if you host it yourself.