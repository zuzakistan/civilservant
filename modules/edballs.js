module.exports = {
	events: {
		message: function ( bot, nick, to, text ) {
			var pc = text.match( /ed balls/gi );
			if ( pc && pc.length !== 0 ) {
				bot.say( to, pc.join( ' ' ) );
			}
		}
	}
};
