var asciify = require( 'asciify' );
module.exports = {
	commands: {
		ascii: {
			help: 'ASCIIifies a phrase',
			command: function ( bot, msg ) {
				asciify( msg.body, function ( e, r ) {
					bot.say( msg.to, r );
				} );
			}
		},
		figlet: {
			help: 'ASCIIifies a phrase',
			command: function ( bot, msg ) {
				msg.args.shift();
				var font = msg.args.shift();
				console.log( 'font', font );
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
