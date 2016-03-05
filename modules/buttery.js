/**
 * Eighteen seconds of spam.
 */
var readline = require( 'readline' );
var fs = require( 'fs' );
module.exports = {
	commands: {
		buttery: {
			help: 'Sings a lovely song',
			aliases: [ 'biscuit', 'base', 'wobble' ],
			privileged: true, // very spammy!
			command: function ( bot, msg ) {
				var rl = readline.createInterface( {
					input: fs.createReadStream( __rootdir + '/data/buttery.txt' ),
					terminal: false
				} );

				rl.on( 'line', function ( line ) {
					bot.say( msg.to, line + '\u200b' /* zero width space */ );
				} );
			}
		}
	}
};
