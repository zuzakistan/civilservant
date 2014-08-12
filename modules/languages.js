var bot = require('..');
var langs = require( 'languages' );
var countries = require( 'i18n-iso-countries' );

bot.addListener('message', function (nick,to,text,message) {
  var args = text.split(' ');
  if (args[0] == "!lang" ) {
    if(!args[1]) {
		bot.say(to,"Usage: !lang <code>");
    }
	if ( langs.isValid(args[1]) ) {
		var info = langs.getLanguageInfo(args[1]);
		bot.say(to,args[1] + ": " + info.name + " → " + info.nativeName);
	} else {
		if (args[1].length !== 2) {
			if (args[1].length === 3) {
				bot.say(to,"Sorry, nobody's bothered making an npm module for ISO 639-3.");
			} else {
				bot.say(to,"Is that an ISO 639-1 code?");
			}
		} else {
			bot.say(to,args[1] + " is not recognised as an ISO 639-1 code.");
		}
	}
  } else if ( args[0] == "!country" ) {
	  if ( !args[1] ) {
		  bot.say(to, "Usage: !country <code>");
	  } else {
		  var code = args[1].toUpperCase();
		  if ( countries.getName(code, 'en') ) {
			  bot.say(to, code + " → " + countries.getName(code, 'en') + ' · ' + countries.getName(code, 'de'));
		  } else {
			  bot.say(to, "Is that an ISO 3166-1 code?");
		  }
	  }
  }
})
