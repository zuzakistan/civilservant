module.exports = {
	commands: {
		random: {
			usage: [ 'number' ],
			help: 'Selects a random integer from 0 to a specified number',
			command: function ( bot, msg ) {
				return String( Math.floor( Math.random() * Math.floor(msg.args.number) ) );
			}
		}
	}
};
