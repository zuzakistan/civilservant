var asciify = require( 'asciify' );
module.exports = {
	commands: {
		ascii: {
			help: 'ASCIIifies a phrase',
			command: function ( bot, msg ) {
				if ( msg.args.indexOf( 'interject' ) !== -1 ) {
					return 'get a job hippie';
				}
				asciify.getFonts( function ( e, b ) {
					asciify(
							msg.body,
							b[Math.floor( Math.random() * b.length )],
							function ( err, res ) {
								bot.say( msg.to, res );
							} );
				} );
			}
		},
		figlet: {
			help: 'ASCIIifies a phrase',
			command: function ( bot, msg ) {
				msg.args.shift();
				var font = msg.args.shift();
				asciify( msg.args.join( ' ' ), font, function ( e, r ) {
					bot.say( msg.to, r );
				} );
			}
		},
		figfonts: {
			help: 'Lists available ASCII fonts',
			command: function ( bot, msg ) {
				asciify.getFonts( function ( e, b ) {
					bot.say( msg.to, b.join( '; ' ) );
				} );
			}
		}
	}
};
