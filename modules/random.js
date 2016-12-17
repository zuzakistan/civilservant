module.exports = {
	commands: {
		random: {
			help: 'Selects a random choice or number',
			command: function ( bot, msg ) {
				if ( msg.args.length > 2 ) {
					msg.args.shift();
					return msg.args[Math.floor( Math.random() * msg.args.length )];
				} else if ( msg.args.length === 2 ) {
					var res = Math.floor( Math.random() * Math.floor( msg.args[1] ) );
					if ( !isNaN( res ) ) {
						return res;
					}
				}
				return 'Usage: (<number>|<choice 1> … <choice n>)';
			}
		}
	}
};
