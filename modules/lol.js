module.exports = {
	events: {
		message: function ( bot, nick, to, text ) {
			if ( text === 'lol' && Math.random() > 0.8 ) {
				bot.shout( to, 'lol' );
			}
		}
	}
};
