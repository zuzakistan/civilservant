var bot = require('..');
var irc = require('irc');
var nox = new irc.Client(bot.config.irc.server,'civilservice',{
  port:6667,channels:['#nethack']
})

nox.addListener('message', function (nick,to,text,message) {
  if(nick == "Rodney") {
    if ((text.indexOf('ross') != -1) || (text.indexOf('zuzak') != -1) || (text.indexOf('samstudio8') != -1) || (text.indexOf('danharibo') != -1)) {
      if(text.indexOf('ross/') != -1) {
        // disallow URLs that aren't pertinent
        return
      }
      bot.notice(bot.config.irc.control,text)
    }
  }
})
nox.addListener('error', function (err) {
  console.log(err);
})
bot.addListener('message', function (nick,to,text,message) {
  if(text.substring(0,8) == "!nethack") {
    bot.say('Rodney', '!' + text.substring(9))
  }
})
