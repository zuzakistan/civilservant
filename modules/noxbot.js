var bot = require('..');
var irc = require('irc');
bot.addListener('message', function (nick,to,tex,message) {
  if(tex.substring(0,8) == "!nethack") {
    var nox = new irc.Client(bot.config.irc.server,'civilservice',{
      port:6667,channels:['#nethack']
    })
    bot.say(bot.config.irc.control,'Nethack reporting on.')

    nox.addListener('message', function (nic,to,text,message) {
      if(nic == "Rodney") {
        if ((text.indexOf('ross ') != -1) || (text.indexOf('zuzak') != -1) || (text.indexOf('samstudio8') != -1) || (text.indexOf('danharibo') != -1)) {
        bot.notice(bot.config.irc.control,text)
      }
    }
    })
  }
})
