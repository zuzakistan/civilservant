var bot = require('..');
var langs = require( 'languages' );

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
			bot.say(to,"Is that an ISO 639-1 code?");
		} else {
			bot.say(to,args[1] + " is not recognised as an ISO 639-1 code.");
		}
	}
  }
})
