module.exports = {
	commands: {
		units: {
			help: 'Get UK alcohol units from ABV and volume (in ml)',
			usage: [ 'abv', 'volume' ],
			command: function ( bot, msg ) {
				return msg.args.volume + 'ml at ' + msg.args.abv + '% ABV is ' + ( msg.args.abv * msg.args.volume ) / 1000 + ' units';
			}
		}
	}
};
