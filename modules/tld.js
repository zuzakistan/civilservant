/**
 * tld.js
 *
 * !tld <tld>
 * Checks whether a given string is a TLD in Iana's database.
 */
var bot = require( '..' );
var request = require( 'request' );
bot.addListener( 'message', function ( nick, to, text ) {
	var args = text.split( ' ' );
	if ( args[0] === '!tld' ) {
		if ( args.length !== 2 ) {
			return bot.say( to, nick + ': usage e.g.: !tld com' );
		}
		request.get( 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt', function ( e, r, b ) {
				if ( e ) {
					return bot.say( to, nick + ': problem fetching data' );
				}
				if ( r.statusCode !== 200 ) {
					return bot.say( to, nick + ': problem fetching data (' + r.statusCode + ')' );
				}
				var data = b.split( '\n' );
				if ( data.indexOf( args[1].toUpperCase() ) !== -1  ) {
					return bot.say( to, nick + ': ' + args[1] + ' is a TLD' );
				} else {
					return bot.say( to, nick + ': ' + args[1] + ' is not in IANA\'s list of TLDs' );
				}
			}
		);
	}
} );

