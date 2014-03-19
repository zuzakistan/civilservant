var bot = require('..');
var irc = require('irc');
var wikipedia = new irc.Client('irc.wikimedia.org','civilservant',{
  port:6667,channels:['#en.wikipedia']
})

wikipedia.addListener('message', function (nick,to,text,message) {
  if ((text.indexOf('Aberystwyth') != -1) || text.indexOf('fig roll') != -1 || text.indexOf(' 144.124.') != -1) {
    bot.notice(bot.config.irc.control,text);
  }
})
wikipedia.addListener('error', function (err) {
  console.log(err);
})
