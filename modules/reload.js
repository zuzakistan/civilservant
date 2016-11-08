var exec = require( 'child_process' ).exec;
var githash = require( 'githash' );
module.exports = {
	commands: {
		reload: {
			privileged: true,
			help: 'Reloads all modules to pick up code changes',
			command: function ( bot ) {
				bot.reload();
				return 'Reloaded.';
			}
		},
		modules: {
			privileged: true,
			help: 'Lists currently loaded modules',
			command: function ( bot ) {
				return bot.modules.length + ' modules loaded (' + bot.modules.join( ', ' ) + ')';
			}
		},
		pull: {
			privileged: true,
			help: 'Pull code from upstream',
			command: function ( bot, msg ) {
				bot.say( msg.to, msg.nick + ': pulling...' );
				exec( 'git pull --rebase', function () {
					bot.say( msg.to, msg.nick + ':        ...reloading...' );
					bot.reload();
					bot.say( msg.to, msg.nick + ':                    ...done.' );
				} );
			}
		},
		hash: {
			help: 'Get hash of the current codebase',
			aliases: [ 'version' ],
			command: function () {
				return 'https://github.com/zuzakistan/civilservant/commit/' + githash();
			}
		}
	},
	events: {
		version: function ( bot, from ) {
			bot.ctcp( from, 'NOTICE', 'VERSION https://github.com/zuzakistan/civilservant/tree/' + githash() );
		}
	}
};
