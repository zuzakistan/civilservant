module.exports = {
	events: {
		message: function ( bot, nick, to, text ) {
			if ( text === 'help me' && Math.random() < 1/5 ) { // 1 in 5
				var interjections = [
					'nah',
					'no'
				];
				return bot.shout( to, interjections[Math.floor( Math.random() * interjections.length )] );
			}
			return false;
		}
	}
};
