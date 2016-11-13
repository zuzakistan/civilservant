var exec = require( 'child_process' ).exec;
module.exports = {
	commands: {
		man: {
			help: 'look up a man page',
			usage: [ 'page' ],
			command: function ( bot, msg ) {
				var c = exec( 'man -f ' + msg.args.page );
				var stdout = '';
				c.stdout.on( 'data', function ( data ) {
					stdout += data.toString();
				} );
				c.on( 'close', function () {
					bot.say( msg.to, stdout );
				} );
			}
		}
	}
};
