var bot = require('..');
var irc = require('irc');
var wikipedia = new irc.Client('irc.wikimedia.org','civilservant',{
  port:6667,channels:[
	'#en.wikipedia','#en.wikinews','#wikimania2014.wikimedia',
	'#en.wiktionary','#en.wikibooks','#en.wikiversity','#en.wikisource',
	'#en.wikivoyage','#meta.wikimedia','#commons.wikimedia']
});

wikipedia.addListener('message', function (nick,to,text) {
  if ((text.indexOf('Aberystwyth') !== -1) || text.indexOf('fig roll') !== -1 || text.indexOf( '144.124.') !== -1) {
    bot.notice(bot.config.irc.control,text);
  } else if ((text.indexOf('Martin Smith (activist)') !== -1) || (text.indexOf('N3hima') !== -1)) {
      bot.notice(bot.config.irc.control,text);
  }
});
wikipedia.addListener('error', function (err) {
  console.log(err);
});
console.log('Loaded RC reporting for English Wikipedia');
