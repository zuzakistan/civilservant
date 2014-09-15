var bot = require('..');
var request = require( 'request' );

bot.addListener( 'message', function( nick, to, text ){
	var args = text.split( ' ' );
	if ( args[0] === '!isup' || args[0] === '!get' || args[0] === '!web' ) {
		if ( to !== bot.config.irc.control ) {
			return;
		}
		request( args[1], function( err, res, body ) {
			if ( err ) {
				bot.say( to, nick + ': ' + err.message );
			} else {
				var str = 'HTTP/' + res.httpVersion + ' ' + res.req.method + ' ' + res.request.href + ' → ' + res.statusCode;
				var flag = '';
				try {
					str += ' (' + res.headers['content-type'] + ' · ' + res.headers.server + ' · ' + body.length + ')';
				} catch(e) {
					flag += '!';
				}
				bot.say( to, nick + ': ' + str + flag );
			}
		});
	}
} );
