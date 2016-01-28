module.exports = {
	events: {
		/* TODO: fix dupe bot var */
		message: function ( bot, nick, to, text ) {
			var pc = text.match( /(ed balls|the greater good|now we know|8|eight)+/gi );
			if ( pc && pc.length !== 0 ) {
				bot.shout( to, pc.join( ' ' ) );
			}
		}
	}
};
