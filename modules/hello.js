module.exports = {
	i18n: {
		hello: {
			en: 'Hello world!',
			de: 'Hallo Welt!'
		},
	},
	commands: {
		hello: {
			help: 'Asks the bot to greet the channel',
			command: function ( bot ) {
				return bot.i18n.hello;
			}
		}
	}
};
