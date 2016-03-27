/**
 * Select a random question from a list, and display it.
 *
 * If an ID is given, display that question.
 * If it isn't, give the last question, plus one.
 * If that's not possible, show a random question.
 *
 * This module needs rewriting.
 */
var fs = require( 'fs' );
var id = null; // TODO do this properly
module.exports = {
	commands: {
		tumblr: {
			help: 'Returns a random question from a selection of viral Tumblr questions.',
			aliases: [ 'truth', 'question', 'conversationprompt' ],
			command: function ( bot, msg ) {
				if ( msg.args[1] === 'clear' ) {
					id = null;
					return 'Wiped history.';
				} else if ( msg.args[1] === 'set' ) {
					if ( msg.args[2] ) {
						id = parseInt( msg.args[2], 10 );
						return 'Set counter to ' + id;
					}
					return 'Unable to set counter.';
				}
				var file = fs.readFileSync( __rootdir + '/data/tumblr.txt', { encoding: 'utf-8' } );
				var questions = file.split( '\n' );
				var rand = Math.floor( Math.random() * questions.length );
				var index = msg.args[1] || id || rand;
				id = parseInt( index, 10 ) + 1;
				var question = questions[index];
				if ( !question ) {
					id = null;
					question = questions[rand];
					index = rand;
				}
				return '[Question ' + index + '/' + questions.length + '] ' + question;
			}
		}
	}
};
