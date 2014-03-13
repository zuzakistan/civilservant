var ping = require('pingit');
var bot = require('..');
var websites = [
  {
    url: 'triage.ironowl.io',
    timeout: 10
  }
]

ping.on('siteDown', function(data) {
  bot.say(bot.config.irc.control, 'samstudio8: Triage is DOWN, you scrub. Get to it.');
  if(data.message) {
    bot.say(bot.config.irc.control, 'samstudio8: ' + data.message);
  }
})
