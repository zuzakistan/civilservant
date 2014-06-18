var bot = require('..');
var schedule = require('node-schedule');
var request = require('request')
var Bitly = require('bitly')
var parser = require('parse-rss')
var rssfeeds = {
  "blastwave": "http://www.blastwave-comic.com/rss/blastwave.xml",
  "dungeongrind": "http://feeds.feedburner.com/dungeongrind",
  "foxtrot": "http://feeds.feedburner.com/Foxtrotcom",
  "frontier": "http://frontier.samnicholls.net/rss",
  "gunnerkrigg": "http://www.gunnerkrigg.com/rss.xml",
  "polandball": "https://pay.reddit.com/r/polandball/.rss",
  "satw": "http://feeds.feedburner.com/satwcomic",
  "schneier": "https://www.schneier.com/blog/atom.xml",
  "smbc": "http://feeds.feedburner.com/smbc-comics/PvLb",
  "tf2": "http://www.teamfortress.com/rss.xml",
  "usgs": "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.atom",
  "wmf": "https://blog.wikimedia.org/feed/",
  "xkcd": "http://xkcd.com/atom.xml"
}
var urls = []

var pulserule = new schedule.RecurrenceRule()
pulserule.second = [0]

var bitly = new Bitly(bot.config.bitly.username, bot.config.bitly.password)

var pulse = schedule.scheduleJob(pulserule, function() {
	try {
  Object.keys(rssfeeds).forEach(function(identifier) {
    var url = rssfeeds[identifier]
    parser(url, function (err, rss) {
      if (err) {
		  return
      }
      try {
        if (urls.indexOf(rss[0].link) == -1) {
		  var color = 0;
		  for ( var i = 0; i<identifier.length;i++) {
			  color += identifier.charCodeAt(i);
		  }
		  color = color % 15
          var str = "\u0003" + color + identifier + '\u0003 ' + rss[0].title + ' '
          if (rss[0].link.length > 40) {
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
	} catch(e){
		return
	}
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
    } else if (args[1] == "del" || args[1] == "rm") {
      try {
        rssfeeds[args[2]] = undefined
        bot.say(to, nick + ": wiped " + args[2] + ".")
      } catch (e) {
        bot.say(to, nick + ": unable to do that :(")
      }
    } else if (args[1] == "list") {
      var concat = "The following identifiers are available: "
      Object.keys(rssfeeds).forEach(function(identifier) {
        concat += " " + identifier
      })
      bot.say(to, nick + ": " + concat)
    } else if (args[1] == "count") {
		bot.say(to, nick + ": " + urls.length + " RSS entries stored");
	}
  }
})
