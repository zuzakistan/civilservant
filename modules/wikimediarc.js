/**
 * wikimediarc.js
 *
 * Sends interesting Wikipedia changes to the main channel.
 *
 * !watchlist
 * Returns the current watchlist.
 */
var bot = require( '..' );
var irc = require( 'irc' );
var wikipedia = new irc.Client( 'irc.wikimedia.org', 'civilservant', {
  port:6667,channels:bot.config.wikipedia.channels
} );

wikipedia.addListener( 'message', function ( nick, to, text ) {
	// mediawiki titles can never have a pipe in them, so this is almost safe
	if ( new RegExp( bot.config.wikipedia.watchlist.join( '|' ), 'i' ).test( text ) ) {
		if ( text.indexOf( '[[Help:Cat-a-lot|Cat-a-lot]]:' ) !== -1 ) {
			return;
		}
		bot.notice(bot.config.irc.control,text);
	}
} );
bot.addListener( 'message', function ( nick, to, text ) {
	if ( text === '!watchlist' ) {
		bot.say( to, nick + ': ' + bot.config.wikipedia.watchlist.join( '; ' ) );
	}
} );
wikipedia.addListener( 'error', function ( err ) {
  console.log( err );
} );
console.log( 'Loaded RC reporting for English Wikipedia' );
