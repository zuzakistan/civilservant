module.exports = {
	events: {
		message: function ( bot, nick, to, text ) {
			if ( text === 'lol' && Math.random() < 1/5 ) { // 1 in 5
				if ( Math.random() < 1/5 ) { // 1 in 25
					if ( Math.random() < 1/5 ) { // 1 in 50
						var interjections = [
							'LMAO',
							'ROFL',
							'blol',
							'doublekek',
							'doublepluskek',
							'hahahaha XD',
							'i can\'t believe you\'ve done this',
							'kek',
							'keke',
							'lel',
							'lmao',
							'lulz',
							'pmsl',
							'rofl',
							'roflmao',
							'rwtsh lol'
						];
						return bot.shout( to, interjections[Math.floor( Math.random() * interjections.length )] );
					}
					return bot.shout( to, 'LOL' );
				}
				return bot.shout( to, 'lol' );
			} else if ( text === 'LOL' && Math.random() < 1/5 ) {
				if ( Math.random() < 1/5 ) {
					return bot.shout( to, 'ＬＯＬ' );
				}
				if ( Math.random() < 2/5 ) {
					return bot.shout( to, 'LOL' );
				}
				return bot.shout( to, 'lol' );
			} else if ( text === 'kek' && Math.random() < 1/5 ) {
				return bot.shout( to, 'kek' );
			}
			return false;
		}
	}
};
