# deck.js remote

This is a remote control plugin for [deck.js](http://imakewebthings.github.com/deck.js/)

## Installation

You can use the service running at http://deckjs-remote.no.de

	<link rel="stylesheet" type="text/css" href="http://deckjs-remote.no.de/deckjs-remote.css" />
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

You'll need to include this mark-up as well:

    <div class="deck-remote-join-message">
        <p>There is a session available. Would you like to join?</p>
        <p class="deck-remote-links">
            <a href="#" class="deck-remote-ignore-link">Ignore</a>
            |
            <a href="#" class="deck-remote-join-link">Join</a>
        </p>
    </div>
    
    <div class="deck-remote-leave-message">
        <p>The session has ended.</p>
        <p class="deck-remote-links">
            <a href="#" class="deck-remote-close-link">Close</a>
        </p>
    </div>

## Usage

To set up the remote, go to your slide url and add the hash #master to the url, e.g. http://imakewebthings.github.com/deck.js/#master

Controlling this deck will control all others currently joined to the session.

## TODO

- Find better way to designate a master
- Add a way to leave a session.