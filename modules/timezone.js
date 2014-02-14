var mediawiki = require('mediawiki-api');
var bot = require('..');
var web = require('./webserver')
var TZ = {};
/*
wiki = new mediawiki('gsi.zuzakistan.com');
wiki.isBot = true;

console.log("Initialised.");
function doShit() {
  console.log("A");
  var login =  wiki.login('Civilservant', 'thisisapassword', function (err, res) {
    console.log("B");
    var tz = getTimezone();
    console.log("tz is " + getTimezone());
    wiki.edit('Template:Timezone', {
      text: getTimezone(),
      minor: true,
      bot: true,
      summary: 'Updating timezone'
    }, function (err, res) {
      console.log("done shit");
    })
  })

  login.addListener('complete', function () {
    console.log("Login complete!");
  })


}
*/

var places = {
  "UTC-12": ["US Minor Outlying Islands"],
  "UTC-11": ["American Samoa", "Niue", "Hawaii"],
  "UTC-10": ["literally France", "Cook Islands", "Aleutian Islands", "Honolulu"],
  "UTC-9":  ["literally France", "Anchorage","Alaska"],
  "UTC-8":  ["literally France","Los Angeles","BC","British Columbia", "Yukon", "Mexico","Pitcairn","California","Idaho","Nevada","Gabe Newell"],
  "UTC-7": ["Calgary","Alberta","Mexico","Arizona","Colorado","Kansas","Utah","Phoenix"],
  "UTC-6": ["Chicago","Winnipeg","Belize","Costa Rica","Alabama"],
  "UTC-5": ["POTUS","New York","Lima","Toronto","Havana","Cuba","Haiti","Jamaica"],
  "UTC-4": ["literally France","Camp","Barbados","Chile","Paraguay"],
  "UTC-3": ["literally France","Falklands","Uruguay","Buenos Aires"],
  "UTC-2": ["South Georgia & South Sandwich Isles"],
  "UTC-1": ["Azores","Cape Verde"],
  "UTC": ["London","Accra","Dublin","Casablanca","Dakar","Lisbon","Greenwich"],
  "UTC+1": ["literally France","Berlin","Paris","Belgrade","Metropolitan France","Madrid","Stockholm","Rome","Sicily","Vatican"],
  "UTC+2": ["Athens","Sofia","Johannesburg","Jerusalem","Kiev","Bucharest"],
  "UTC+3": ["literally France","Nairobi","Baghdad","Khartoum","Minsk","Riyadh"],
  "UTC+4": ["literally France","Dubai","Baju","Moskow"],
  "UTC+5": ["literally France","Karachi","Pakistan","Turkmenistan"],
  "UTC+6": ["British Indian Ocean Territory","parts of Kazakhstan"],
  "UTC+7": ["Jakarta","Bankok","Hanoi"],
  "UTC+8": ["Beijing","Perth","Singapore","Kuala Lumpur"],
  "UTC+9": ["Seoul","Tokyo","Pyongyang"],
  "UTC+10": ["Canberra","ACT","Federated States of Micronesia","Guam"],
  "UTC+11": ["literally France","Vladivostok",],
  "UTC+12": ["literally France","Wellington","Auckland","the South Pole"],
  "default": ["Earth"]
}
/**
 * gets the offset between an hour and the user's personal hour
 * @param canonical time to calculate offset for (generally should be
 * date.getHours()
 * @param nick to calculate offset for
 * @return the hours between the the canonical and personal times
 */
function getOffset(x,nick) {
  var y = x + TZ[nick];
  if ( y > 23) {
    y += 12;
  } else if ( y < 0 ) {
    y -= 12;
  }
  return y;
}

function getUtc(nick){
  if (TZ[nick] == 0) {
    return "UTC"
  } else if (TZ[nick] > 0) {
    return "UTC+"+TZ[nick]
  } else {
    return "UTC"+TZ[nick]
  }
}
function getPlacename(utc) {
  if(!places[utc]){
    utc = "default"
  }
  return places[utc][Math.floor(Math.random() * places[utc].length)];
}

bot.addListener('message', function (nick, to, text, message) {
  var args = text.split(' ');
  var now = new Date;
  if (args[0] == "!tz") {
    if(args[1] == "help") {
      bot.say(to, nick + ": !tz to get your current timezone. !tz set <hour> to derive and set your timezone from the hour specified. !tz list to show all personal timezones.")
      return
    }
    if(args[1] == "list" || args[1] == "all") {
      var list = "";
      for (var key in TZ) {
        list = list + pad(getOffset(now.getHours(),key)) + ":" + pad(now.getMinutes()) + " " +  key.charAt(0).toUpperCase() + "PT  "
      }
      bot.say(to, nick + ": " + list + " http://horologicalaffairs.gsi.zuzakistan.com/")
      return
    }
    if(args[1] == "set") {
      if(args[2] > -1 && args[2] < 24){
        TZ[nick] = args[2] - now.getHours()// - args[2]
        if (TZ[nick] > 12) {
          TZ[nick] -= 24
        }
      } else {
        bot.say(to, nick + ": invalid time");
      }
    }
    if (!TZ[nick]){
      TZ[nick] = 0;
    }
    var timezone = getUtc(nick)
    bot.say(to, "It is currently " + pad(getOffset(now.getHours(),nick)) + ':' + pad(now.getMinutes()) + " " + nick.charAt(0).toUpperCase() + "PT (" + timezone + " · " + getPlacename(timezone) + ")");
  } else if (args[0] == "!france") {
     if (!TZ[nick]){
      TZ[nick] = 0;
    }
    if (places[getUtc(nick)][0] == "literally France") {
      bot.say(to, nick + ": you are literally France");
    } else {
      bot.say(to, nick + ": you are not literally France");
    }
  }
})

function pad(number) {
  number = "00" + number;
  return number.substr(number.length-2)
}

web.get('/timezones.json', function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(TZ);
})

web.get('/census.json', function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var people = {};
  Object.keys(TZ).forEach(function(nick){
    people[nick] = {}
    people[nick]["french"] = (places[getUtc(nick)][0] == "literally France")
    people[nick]["offset"] = TZ[nick]
  })
  res.json({"version":"2.0.0","denizens":people})
})
