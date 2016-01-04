[![Build Status](https://travis-ci.org/zuzakistan/civilservant.svg)](https://travis-ci.org/zuzakistan/civilservant) (*n.b.* actually just a lint)

This is an IRC bot written in NodeJS.


## config.json
Here is a minimal `config.json` to get started. The IRC object is passed straight into the `node-irc` module, so you can do SASL and things.
```js
{
	"irc": {
		"server": "irc.freenode.net",
		"port": 6667,
		"nick": "civilservant",
		"channels": [
			"##zuzakistan-lab"
		],
		"controlChar": "!"
		"control": "##zuzakistan-lab",
		"quiet": false
	},
	"bitly": {
		"username": "",
		"password": ""
	},
	"touchtosuccess": {
		"url": "http://newmarco.co.uk/our_menu.php?categoryId=303405"
	},
	"installModules": false
}
```

Some explanation of the not-obvious options:
* `controlChar`: the prefix for commands, such as `!help`.
  Changing it to `%` would make commands like `%help`.
  This is useful for lessening collisions when you have lots of bots in a channel.
* `control`: the "admin" channel for the bot. It's recommended that you have
  this as a separate, `+i` channel with trusted people in -- anyone in the control
  channel can perform potentially dangerous commands.
* `installModules`: whether to attempt(!) to install missing NPM modules.
  If set to `false`, it'll just quit and ask you to install manually.

# Installation
Some modules require the `canvas` module, which depends on Cairo.
You may need to install `libcairo2-dev` and `libpango1.0-dev` on Ubuntu.
On CentOS, you apparently need `cairo` and `cairo-devel`.

If you are having problems installing these, just delete the `modules/imgur.js` file.
We won't mind.
