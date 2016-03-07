/**
 * concern.js
 *
 * !concern
 * Toggles whether the bot should interrupt charged conversations
 * with an unhelpful message.
 */
var isEmotional = require( 'emotional_alert' );
var nox = false;
var verbose = true; // TODO: cvar

module.exports = {
	commands: {
		concern: {
			help: 'Toggles announcements of concern',
			command: function () {
				if ( !nox ) {
					nox = true;
					return 'adopting air of unconcern';
				}
				nox = false;
				return 'concerning myself with matters';
			}
		}
	},
	events: {
		message: function ( bot, nick, to, text ) {
			if ( !nox ) {
				var x = isEmotional( text );
				if ( x.emotional ) {
					if ( x.winner ) {
						var adj = {
							0: '',
							1: 'slightly ',
							2: 'rather ',
							3: 'quite ',
							4: 'very ',
							5: 'extremely ',
							6: 'copiously ',
							7: 'agonizingly '
						};
						x.adj = adj[x.emotional] === undefined ? 'a tad ' : adj[x.emotional];
						switch ( x.winner ) {
							case 'anger':
								x.hwinner = 'angry';
								break;
							case 'stress':
								x.hwinner = 'stressed';
								break;
							case 'sad':
								/* falls through */
							default:
								x.hwinner = x.winner;
						}

						bot.shout( to, nick + ': you seem ' + x.adj + x.hwinner + ' (score: ' + x.emotional + ')' );
					} else if ( verbose ) { // danger phrase
						bot.shout( to, nick + ': that is a worrying thing to say' );
					}
				}
			}
		}
	}
};
