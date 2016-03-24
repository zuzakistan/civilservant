module.exports = {
	events: {
		message: function ( bot, nick, to, text ) {
			if ( text === 'lol' && Math.random() > 0.8 ) { // 1 in 5
				if ( Math.random() > 0.8 ) { // 1 in 25
					if ( Math.random() > 0.8 ) { // 1 in 125
						var interjections = [
							'hahahaha XD'
						];
						bot.shout( to, interjections[Math.floor( Math.random() * interjections.length )] );
					}
					bot.shout( to, 'LOL' );
				} else {
					bot.shout( to, 'lol' );
				}
			}
		}
	}
};
