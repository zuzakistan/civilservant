/**
 * duckfacts.js
 *
 * Sends a load of spam to a phone number on command.
 *
 * !duckfact
 * Sends an SMS containing a carefully curated fact about everybody's
 * favourite species in the Anatidae family of birds.
 * [Control channel only.]
 *
 */
var bot = require( '..' );
var read = require( 'fs' ).readFileSync;
var write = require( 'fs' ).writeFileSync;


var request = require( 'request' );
bot.addListener( 'message', function ( nick, to, text ) {
	var args = text.split( ' ' );
	if ( args[0] === '!duckfact' ) {
		if ( to !== bot.config.irc.control ) {
			return;
		}
		var number =  bot.config.ziron.duckfact;

		var duckfacts = JSON.parse( read( './duckfacts.json' ) );
		var duckfact = duckfacts.shift();
		var data = 'dst=' + number + '&data=' + duckfact;
		data += '&src=' + bot.config.ziron.sender;
		request.post( 'https://api.ziron.net/v1/Accounts/' + bot.config.ziron.auth.sid + '/Messages', {
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			auth: {
				user: bot.config.ziron.auth.sid,
				pass: bot.config.ziron.auth.token
			},
			strictSSL: true,
			body: data
		}, function ( e, r, b ) {
			if ( e ) {
				console.log( e );
				bot.say( to, nick + ': SMS request failed badly (' + e + ')' );
			}
			if ( r.statusCode !== 200 ) {
				bot.say( to, nick + ': SMS request failed (' + r.statusCode + ')');
				try {
					b = JSON.parse( b );
					bot.say( to, nick + ': ' + b.error.errormessage );
					console.log( data );
				} catch ( e ) {
					bot.say( to, nick + ': bad json' );
				}
				return;
			}
			console.log( b );
			b = JSON.parse( b );
			b = b[0];
			bot.say( to, nick + ': ' + b.type + ' from ' + b.src + ' (' + b.data + ')' );
			write( './duckfacts.json', JSON.stringify( duckfacts, null, '    ' ) );
		} );
	}
} );

