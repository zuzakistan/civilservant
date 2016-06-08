module.exports = {
	events: {
		message: function ( bot, nick, to, text ) {
			if ( text === 'lol' && Math.random() > 0.8 ) { // 1 in 5
				if ( Math.random() > 0.8 ) { // 1 in 25
					if ( Math.random() > 0.5 ) { // 1 in 50
						var interjections = [
							'LMAO',
							'ROFL',
							'doublekek',
							'doublepluskek',
							'hahahaha XD',
							'kek',
							'keke',
							'lel',
							'lmao',
							'lulz',
							'psml',
							'rofl',
							'roflmao',
							'rwtsh lol',
							'i can\'t believe you\'ve done this'
						];
						return bot.shout( to, interjections[Math.floor( Math.random() * interjections.length )] );
					}
					return bot.shout( to, 'LOL' );
				}
				return bot.shout( to, 'lol' );
			} else if ( text === 'LOL' && Math.random() > 0.8 ) {
				if ( Math.random() > 0.8 ) {
					return bot.shout( to, 'ＬＯＬ' );
				}
				if ( Math.random() > 0.4 ) {
					return bot.shout( to, 'LOL' );
				}
				return bot.shout( to, 'lol' );
			}
			return false;
		}
	}
};
