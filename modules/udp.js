module.exports = {
	events: {
		udp: function ( bot, msg ) {
			bot.notice( bot.config.udp.channel, msg.toString() );
		}
	}
};

