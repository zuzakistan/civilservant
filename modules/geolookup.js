/**
 * geolookup.js
 *
 * !geo <ip address>
 * Looks up the location of an IP address.
 *
 */
var client = require( '..' );
var request = require( 'request' );
client.addListener( 'message', function ( nick, to, text ) {
	var args = text.split( ' ' );
	if ( args[0] === '!geo' ) {
		request( 'https://freegeoip.net/json/' + args[1], function ( e, r, b ) {
			if ( e ) {
				return;
			}
			try {
				var dat = JSON.parse( b );
				client.say( to, nick + ': ' + dat.ip + ' → ' + dat.country_code );
			} catch ( e ) {
				client.say( to, nick + ': something went wrong: ' + e.message );
			}
		} );
	}
} );

