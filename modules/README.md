# Modules
Files in this directory are automatically loaded as modules in the bot during runtime.

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

You can access all arguments, excluding the command itself, using `msg.body`.

See also: `commands.usage`, below.


## Metadata
"Metadata" for commands can be stored by adding an object level.
Put the main logic under "command".

### Restricting access
Privileged commands will only run within the control channel.
```js
module.exports = {
	commands: {
		foo: {
			privileged: true,
			command: function ( bot, msg ) {
				// your code here
			}
		}
	}
};
```

### Adding aliases
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
	},
	xyzzy: function () {
		// you can also have multiple commands in a module
	}
};
```

### Help strings
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

### Fixed usage
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

### Disabling commands
If the `disabled` key is truthy, the command handler will return before the command itself is processed.
Similarly, the `deprecated` key will display warnings at appropriate junctures, but won't actually
prevent the command from running.

## Additional methods
By default, if a string is returned in a command's function it will be output to the
channel prefixed by the requesting nickname. If you don't want this, you can leverage
the `bot` object (which is the running bot). See the `node-irc` documentation for details;
useful methods include `bot.say()` and `bot.notice()`.

In addition to `bot.say()`, there is also `bot.shout()`.
These are almost identical in that they both send a message to a channel.
However, calls to `bot.shout()` can be toggled via a configuration variable: use it any time the bot
sends an unsolicited message (one that has not been explicitly requested by a user), so that the
bot can easily be used in more "serious" channels.

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

Other events are available:
* The `version` event runs whenever someone CTCP VERSIONs the bot.
* The `pm` event runs whenever someone talks in private message to the bot (this also fires
  the `message` event.
* The `action` event runs whenever someone uses a `/me`-style command (including private messages).
  Note that actions do not fire the `message` or `pm` event.
* The `url` and `urls` events run whenever a URL is sent within a message.
  The two are different:
	* The `urls` event fires up to once for each message, and passes an array of strings of the URLs
	  featured in that message, followed by the usual `message` arguments.
	* The `url` event fires on every individual URL, and passes a URL object
	  followed by the usual `message` arguments. Use `url.href` to get the raw URL.
	* The `url` event accepts arguments: `url:github.com` will only fire on URLs to that host.
* The `news` and `rawnews` events (see `news.js`).

## General notes
* Messages sent to channels after an explicit request should use `bot.say()`.
  Messages that are not doing so should use `bot.shout()`.
