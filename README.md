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
				//port: 80,
				//key: [md5 hash]
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

    <div class="deck-remote-master-message">
		<p>Do you have the key?</p>
		<p class="deck-remote-master-feedback"></p>
		<form class="deck-remote-master-form" action="">
			<p>
				<input class="deck-remote-password" type="password" />
			</p>
			<p class="deck-remote-links">
				<button type="submit">Start Session</button>
			</p>
		</form>	
	</div>

## Usage

To set up the remote, go to your slide url and add the param "master" to the url, e.g. http://imakewebthings.github.com/deck.js/?master

You will then be prompted to enter the key. The default key is "master".

Controlling this deck will control all others currently joined to the session.

## MIT License

Copyright (c) 2011 Chris Jaure

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## TODO

- Refactor UI.
- Add a way to leave a session.