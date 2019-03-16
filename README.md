[![Build Status](https://travis-ci.org/zuzakistan/civilservant.svg)](https://travis-ci.org/zuzakistan/civilservant)
[![Script Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Known Vulnerabilities](https://snyk.io/test/github/zuzakistan/civilservant/master/badge.svg)](https://snyk.io/test/github/zuzakistan/civilservant)

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
		"quiet": false,
		"insecure": false,
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
  channel can perform potentially dangerous commands. Set `insecure` to `true` to
  allow other channels access to these commands.
* `installModules`: whether to attempt(!) to install missing NPM modules.
  If set to `false`, it'll just quit and ask you to install manually.
* `quiet` toggles unsolicited pronouncements. If you like your bots to speak
  only when spoken to, set this to `true`.

## Known issues
Sometimes the UDP server doesn't shut down properly.
Do `netstat -tulpn` and grep for the PID to kill manually.
