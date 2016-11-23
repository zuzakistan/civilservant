module.exports = {
	commands: {
		units: {
			help: 'Get UK alcohol units from ABV and volume (in ml)',
			usage: [ 'abv', 'volume' ],
			command: function ( bot, msg ) {
				return String( ( msg.args.abv * msg.args.volume ) / 1000 );
			}
		}
	}
};
