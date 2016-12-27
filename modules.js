var npm = require( 'npm' );
var fs = require( 'fs' );
const MODULE_DIR = './modules';

var self = module.exports = {
	loadAllModules: function ( bot, dir ) {
		dir = dir || MODULE_DIR; // default param
		// clear existing:
		bot.events = {};
		bot.modules = []; // informational only
		bot.commands = [];

		return fs.readdir( dir, function ( err, files ) {
			for ( var i = 0; i < files.length; i++ ) {
				if ( files[i].substr( -3 ) === '.js' ) {
					if ( self.loadModule( bot, dir + '/' + files[i] ) ) {
						// console.log( 'Loaded ' + files[i] );
						bot.modules.push( files[i] );
					} else {
						console.log( 'Failed ' + files[i] );
						bot.msg( bot.config.irc.control, 'Failed to load ' + files[i] );
					}
				}
			}
			return err;
		} );
	},
	loadModule: function ( bot, file ) {
		try {
			var filename = require.resolve( file );
			delete require.cache[filename];

			var curr = require( file );
			if ( curr.commands ) {
				self.addCommands( bot, curr.commands );
			}
			if ( curr.events ) {
				self.addEvents( bot, curr.events );
			}
			return true;
		} catch ( e ) {
			if ( e.code === 'MODULE_NOT_FOUND' ) {
				var npmModule = e.message.split( '\'' )[1];
				if ( bot.config.installModules ) {
					console.log( 'Required module ' + npmModule + ' not found; installing' );
					self.installNpm( npmModule, function ( e ) {
						if ( e ) {
							throw e;
						}
						self.loadModule( curr );
					} );
				} else {
					console.error( 'Please run `npm install --save ' + npmModule + '`' );
					process.exit( 1 );
				}
			} else {
				console.log( e );
				console.log( e.stack );
			}
			return false;
		}
	},
	addCommands: function ( bot, commands, clobber ) {
		var keys = Object.keys( commands );
		for ( var i = 0; i < keys.length; i++ ) {
			var cmd = commands[keys[i]];
			if ( bot.commands[keys[i]] && clobber ) {
				console.log( 'Won\'t clobber: ' + keys[i] );
				continue;
			}
			bot.commands[keys[i]] = cmd;
			// console.log( 'Added command: ' + keys[i] );
			if ( cmd.aliases ) {
				for ( var j = 0; j < cmd.aliases.length; j++ ) {
					bot.commands[cmd.aliases[j]] = commands[keys[i]];
					// console.log( 'Aliased ' + cmd.aliases[j] + ' to ' + keys[i] );
				}
			}
		}
	},
	addEvents: function ( bot, events ) {
		var keys = Object.keys( events );
		for ( var i = 0; i < keys.length; i++ ) {
			var x = keys[i];
			if ( !bot.events[x] ) {
				bot.events[x] = [];
			}
			bot.events[x].push( events[x] );
		}
	},
	installNpm: function ( module, callback ) {
		npm.load( function ( err ) {
			if ( err ) {
				throw err;
			}
			npm.commands.install( [module], function ( err ) {
				callback( err );
			} );
		} );
	}

};
