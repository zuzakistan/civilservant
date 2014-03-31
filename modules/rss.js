var bot = require('..');
var schedule = require('node-schedule');
var request = require('request')
var Bitly = require('bitly')
var parser = require('parse-rss')
var rssfeeds = {
  "schneier": "https://www.schneier.com/blog/atom.xml",
  "xkcd": "http://xkcd.com/atom.xml",
  "foxtrot": "http://feeds.feedburner.com/Foxtrotcom",
  "smbc": "http://feeds.feedburner.com/smbc-comics/PvLb"
}
var urls = []

var pulserule = new schedule.RecurrenceRule()
pulserule.second = [0]

var bitly = new Bitly(bot.config.bitly.username, bot.config.bitly.password)

var pulse = schedule.scheduleJob(pulserule, function() {
  Object.keys(rssfeeds).forEach(function(identifier) {
    var url = rssfeeds[identifier]
    parser(url, function (err, rss) {
      if (err) {
        console.log(err)
      }
      try {
        if (urls.indexOf(rss[0].link) == -1) {
          var str = "\u0003" + (parseInt(identifier.length,16)%15) + identifier + '\u0003 ' + rss[0].title + ' '
          if (rss[0].link.length > 25) {
            bitly.shorten(rss[0].link, function (err, res) {
              str += res.data.url
              bot.config.irc.channels.forEach(function(chan) {
                bot.notice(chan, str)
              })
            })
          } else {
            str += rss[0].link
            bot.config.irc.channels.forEach(function(chan) {
              bot.notice(chan, str)
            })
          }
          urls.push(rss[0].link)
        }
      } catch(e) {
        // do nowt
      }
    })
  })
})


bot.addListener('message', function (nick,to,text,message) {
  var args = text.split(' ')
  if (args[0] == "!rss" ) {
    if (args[1] == "add" || args[1] == "set") {
      if(args.length == 4) {
        if (typeof rssfeeds[args[2]] == 'undefined') {
          rssfeeds[args[2]] = args[3]
          bot.say(to, nick + ": added " + args[3] + " as " + args[2])
        }  else {
          bot.say(to, nick + ": cannot add " + args[2] + " (something already exists there)")
        }
      } else {
        bot.say(to, nick + ": Usage: !rss add <identifier> <url>")
      }
    } else if (args[1] == "get") {
      try {
        bot.say(to, nick + ": " + args[2] + " => " + rssfeeds[args[2]])
      } catch (e) {
        bot.say(to, nick + ": can't do that.")
      }
    }
  }
})
