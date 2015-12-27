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
			"##zuzakistan"
		],
		"controlChar": "!"
		"control": "##zuzakistan-lab"
	},
	"bitly": {
		"username": "",
		"password": ""
	},
	"touchtosuccess": {
		"url": "http://newmarco.co.uk/our_menu.php?categoryId=303405"
	}
}
```
