/**
 * dns.js
 *
 * !rdns <ip address>
 * !host <ip address>
 * Queries the DNS server for the reverse DNS of an IP.
 *
 */
var bot = require( '..' );
var dns = require( 'dns' );

bot.addListener( 'message', function ( nick, to, text ) {
	var args = text.split( ' ' );
	if ( args[0] === '!rdns' || args[0] === '!host' ) {
		try {
			dns.reverse( args[1], function ( err, data ) {
				if ( err ) {
					bot.say( to, nick + ': ' + err + ' ' + args[1] );
				} else {
					for ( var i = 0; i < data.length; i++ ) {
						bot.say( to, nick + ': ' + args[1] + ' → ' + data[i] );
					}
				}
			} );
		} catch ( e ) {
			bot.say( to, nick + ': ' + e.message );
		}
	}
} );
