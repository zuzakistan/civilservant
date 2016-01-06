/**
 * Port of dbot/dbot's quotes feature
 */
var fs = require( 'fs' );
var quotes = {};
try {
	quotes = require( __rootdir + '/data/quotes.json' );
} catch ( e ) {
	//
}
module.exports = {
	commands: {
		qadd: {
			help: 'Add a quote',
			command: function ( bot, msg ) {
				msg.args.shift();
				var body = msg.args.join( ' ' ).split( '=' );
				var key = body.shift();
				body = body.join( '=' ); // so clunky
				if ( !body || !key ) {
					return 'Usage: ' + bot.config.irc.controlChar + 'qadd foo=bar';
				}
				if ( !quotes[key] ) {
					quotes[key] = [ body ];
				} else {
					quotes[key].push( body );
				}

				fs.writeFile( __rootdir + '/data/quotes.json', JSON.stringify( quotes, null, 4 ) );
				return 'Added quote "' + body + '" to "' + key + '".';
			}
		}
	}
};
