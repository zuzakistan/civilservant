var rot = require( 'rot' );
module.exports = {
	commands: {
		rot13: {
			help: 'Rotational letter substitution.',
			command: function ( bot, msg ) {
				msg.args.shift();
				return rot( msg.args.join( ' ' ) );
			}
		},
		rot: {
			help: 'Buggy rotational letter substitution.',
			command: function ( bot, msg ) {
				// remove first two elements
				// !rot 13 abc def ghi
				var index = msg.args.shift();
				index = msg.args.shift();
				return rot( msg.args.join( ' ' ), index );
			}
		}
	}
};
