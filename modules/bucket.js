// inspired by xkcd's bucket :)
var inventory = [];

function addToInventory( item ) {
	if ( inventory.push( item ) > 5 ) {
		return inventory.shift();
	}
}

module.exports = {
	events: {
		action: function ( bot, nick, to, text ) {
			var synonyms = [
				'awards',
				'gives',
				'hands',
				'lends',
				'passes'
			];
			var regex = new RegExp( '(' + synonyms.join( '|' ) + ') ' + bot.nick + ' (.+)' );

			var matches = regex.exec( text );
			console.log( matches );

			if ( matches ) {
				var newItem = matches[2];
				var oldItem = addToInventory( newItem );
				if ( oldItem ) {
					bot.action( to, 'picks up ' + newItem + ' and drops ' + oldItem );
				} else {
					bot.action( to, 'picks up ' + newItem );
				}
			}
		}
	},
	commands: {
		inventory: {
			help: 'Displays the inventory of the bot',
			command: function () {
				return 'I\'m holding ' + inventory.join( ' and ' );
			}
		}
	}
};

