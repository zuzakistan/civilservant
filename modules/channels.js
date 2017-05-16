module.exports = {
	commands: {
		chans: {
			restricted: true,
			help: 'List current channels',
			command: function ( bot ) {
				return 'Current channels: ' + Object.keys( bot.chans ).join( ', ' );
			}
		}
	}
};
