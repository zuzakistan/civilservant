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

bot.addListener( 'nick', function ( oldnick, newnick, channels ){
	nicks.push({
		'new': newnick,
		'old': oldnick,
		'ts': Date.now(),
		'channels': channels
	});
	fs.writeFile( __dirname + '/../data/channel-nicks.json', JSON.stringify( nicks, null, 4 ) );
} );

bot.addListener( 'message', function ( nick, to, text ) {
	if ( text === '!nickcount' ) {
		bot.say( to, nick + ': ' + Array.length + ' nick changes tracked' );
	}
} );
