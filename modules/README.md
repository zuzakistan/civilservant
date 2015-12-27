# Modules
## Hello world example
This is a small module that will reply "Hello, world!" if someone says `!hello` in chat:
```js
module.exports = {
	commands: {
		hello: function ( bot, msg ) {
			return 'Hello, world!';
		}
	}
};
```

You can access arguments to commands like thus (`!foo bar` will make the bot say "bar"):
```js
module.exports = {
	commands: {
		foo: function ( bot, msg ) {
			if ( msg.args.length > 1 ) {
				return msg.args[1];
			}
		}
	}
};
```

## Restricting access
"Metadata" for commands can be stored by adding an object level.
Put the main logic under "command".
Privileged commands will only run within the control channel.
```js
module.exports = {
	commands: {
		foo: {
			priveleged: true,
			command: function ( bot, msg ) {
				// your code here
			}
		}
	}
};
```

## Adding aliases
You can alias commands by adding an `aliases` key:
```js
module.exports = {
	commands: {
		foo: {
			aliases: [ 'bar', 'baz' ],
			command: function ( bot, msg ) {
				// your code here
			}
		}
	}, xyzzy: function () {
		// you can also have multiple commands in a module
	}
};
```

## Help strings
It's good practice to tell the user what a command does; adding a `help` key will
allow the user to query a commands with `!help foo`.
```js
module.exports = {
	commands: {
		foo: {
			help: 'Tells the bot to do something',
			command: function ( bot, msg ) {
				// your code here
			}
		}
	}
};
```

## Fixed usage
Argument validation and extraction is helped by the `usage` key, which should be
an array of the arguments' meanings from left to right. If the arguments aren't present,
a help message is displayed instead of running the command.
```js
module.exports = {
	commands: {
		foo: {
			help: 'A test for arguments',
			usage: [ 'xyzzy' ],
			command: function ( bot, msg ) {
				return msg.args.xyzzy; // also accessible as msg.args[1]
			}
		}
	}
};
```

## Disabling commands
If the `disabled` key is truthy, the command handler will return before the command itself is processed.

## Events
By default commands begin with `!`, but this can be configured in `config.json`.
If you need something  to run on every message, you can add a (single) event:
```js
module.exports = {
	events: {
		message: function ( nick, to, text, message ) {
			// your logic here
		}
	}
};
```
## Additional methods
By default, if a string is returned in a command's function it will be output to the
channel prefixed by the requesting nickname. If you don't want this, you can leverage
the `bot` object (which is the running bot). See the `node-irc` documentation for details;
useful methods include `bot.say()` and `bot.notice()`.

The `msg` object contains useful properties:
```js
var msg = {
	args: [ '!foo', 'bar', 'baz' ], // arguments to the command
	nick: 'timbl', // requesting nickname,
	to: '#freenode', // channel wherein command was invoked
	text: '!foo bar baz',
	message: { /* see node-irc for documentation */ }
};
```

