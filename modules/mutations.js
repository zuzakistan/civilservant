module.exports = {
	commands: {
		soft: {
			aliases: [ 'mutate', 'treglad', 'meddal' ],
			help: 'Softly mutates a given word',
			usage: [ 'noun' ],
			command: function ( bot, msg ) {
				var initial = msg.args.noun.charAt( 0 );
				var rest = msg.args.noun.substr( 1 );
				switch ( initial ) {
					/*  G LlMRh */
					case 'p':
						return 'b' + rest;
					case 't':
						return 'd' + rest;
					case 'c':
						return 'g' + rest;
					case 'b':
					case 'm':
						return 'f' + rest;
					case 'd':
						return 'dd' + rest;
					case 'g':
						return rest;
					case 'l':
						if ( rest.charAt( 0 ) === 'l' ) {
							return rest;
						}
						break;
					case 'r':
						if ( rest.charAt( 0 ) === 'h' ) {
							return 'r' + rest.substr( 1 );
						}
					}
				return msg.args.noun;
			}
		}
	}
};
