module.exports = {
	events: {
		/* TODO: fix dupe bot var */
		message: function ( _bot, bot, nick, to, text ) {
			var pc = text.match( /(ed balls|the greater good)+/gi );
			if ( pc && pc.length !== 0 ) {
				bot.say( to, pc.join( ' ' ) );
			}
		}
	}
};
