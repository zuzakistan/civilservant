var bot = require('..');
var irc = require('irc');
var nox = new irc.Client(bot.config.irc.server,'civilservice',{
  port:6667,channels:['#nethack']
})

nox.addListener('message', function (nick,to,text,message) {
  if(nick == "Rodney") {
    if ((text.indexOf('zuzak') != -1) || (text.indexOf('samstudio8') != -1) || (text.indexOf('danharibo') != -1)) {
      bot.notice(bot.config.irc.control,text)
    }
  }
})
nox.addListener('error', function (err) {
  console.log(err);
})
