/**
 * ziron.js
 *
 * Sends text messages.
 *
 * !ziron balance
 * Get current balance.
 *
 * !ziron <recipient> <message>
 * Sends a text message.
 *
 * !ziron status
 * Gets the current statuspage for Ziron.
 */
var bot = require( '..' );
var request = require( 'request' );
bot.addListener( 'message', function ( nick, to, text ) {
	var args = text.split( ' ' );
	if ( args[0] === '!ziron' ) {
		if ( to !== bot.config.irc.control ) {
			return;
		}
		if ( args[1] === 'send' ) {
			if ( bot.config.ziron.numbers[args[2]] === undefined ) {
				bot.say( to, nick + ': cannot send SMS to ' + args[2] );
				return;
			}
			var number =  bot.config.ziron.numbers[args[2]];
			var data = args;
			data.splice(0, 3);
			data = data.join( ' ' );
			data = '<' + nick + '> ' + data;
			data = 'dst=' + number + '&data=' + data;
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
			} );
		} else if ( args[1] === 'balance' ) {
			request.get( 'https://api.ziron.net/v1/Accounts/' + bot.config.ziron.auth.sid + '/Balances', {
				auth: {
					user: bot.config.ziron.auth.sid,
					pass: bot.config.ziron.auth.token
				}
			}, function ( e, r, b ) {
				if ( e ) {
					bot.say( to, nick + ': balance lookup really failed (' + e + ')' );
					return;
				} else {
					try {
						b = JSON.parse( b );
						bot.say( to, nick + ': ' + b.balance + ' ' + b.currency );
					} catch ( e ) {
						bot.say( to, nick + ': balance lookup failed (' + e + ')' );
					}
				}
			} );
		} else if ( args[1] === 'status' ) {
			request( 'http://4gpn7rl0y50f.statuspage.io/api/v1/status.json', function ( e, r, b ) {
				if ( e ) {
					return;
				}
				try {
					var data = JSON.parse( b );
					var str = data.page.name + ' status: \u0003';
					switch ( data.status.indicator ) {
						case 'none':
							str += '3';
							break;
						case 'minor':
							str += '8';
							break;
						case 'major':
							str += '4';
							break;
						case 'critical':
							str += '4\u0002';
							break;
						default:
							str += '14';
					}
					str += data.status.description;
					str += '\u0003 ' + data.page.url;
					bot.say( to, str );
				} catch ( e ) {
					bot.say( to, nick + ': unable to retrieve status' + e.message );
				}
			} );
		}
	}
} );

