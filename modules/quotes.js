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
				var body = msg.body.split( '=' );
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
				return 'Added quote "' + body + '" to "' + key + '" (' + quotes[key].length + ').';
			}
		},
		quote: {
			help: 'Gets a quote',
			command: function ( bot, msg ) {
				try {
					var q = quotes[msg.body];
					return q[Math.floor( Math.random()*q.length )];
				} catch ( e ) {
					return e;
				}
			}
		},
		quotel: {
			help: 'Lists quote categories',
			command: function () {
				var str = '';
				var keys = Object.keys( quotes );
				for ( var i = 0; i < keys.length; i++ ) {
					str += ' ' + keys[i] + ' (' +quotes[keys[i]].length + ') ·';
				}
				return str.substring( 0, str.length - 1 );
			}
		}
	}
};
