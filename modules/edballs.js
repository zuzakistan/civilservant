module.exports = {
	events: {
		/* TODO: fix dupe bot var */
		message: function ( bot, nick, to, text ) {
			/**
			 * https://twitter.com/edballs/status/63623585020915713
			 * http://i.imgur.com/aFhWSah.webm
			 * https://www.youtube.com/watch?v=w4CQin03MDQ
			 * http://thestanleyparable.wikia.com/wiki/Eight
			 */
			var pc = text.match( /(ed balls|the greater good|now we know|eight)+/gi );
			if ( pc && pc.length !== 0 ) {
				bot.shout( to, pc.join( ' ' ) );
			}
		}
	}
};
