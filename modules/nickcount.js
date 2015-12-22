/**
 * nickcount.js
 *
 * Keeps track of nicks.
 *
 * !nickcount
 * Replies with the cumulative count of nicknames tracked.
 */
var bot = require( '..' );
var fs = require( 'fs' );

var nicks = require( __dirname + '/../data/channel-nicks.json' );

bot.addListener( 'nick', function ( oldnick, newnick ){
	nicks.push(newnick);
	fs.writeFile( __dirname + '/../data/channel-nicks.json', JSON.stringify( nicks, null, 4 ) );
} );

bot.addListener( 'message', function ( nick, to, text ) {
	if ( text === '!nickcount' ) {
		bot.say( to, nick + ': ' + Array.length + ' nick changes tracked' );
	}
} );
