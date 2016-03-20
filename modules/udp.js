module.exports = {
	events: {
		udp: function ( bot, msg ) {
			bot.notice( bot.config.irc.control, msg.toString() );
		}
	}
};

