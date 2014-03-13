var mediawiki = require('mediawiki-api');
var bot = require('..');
var web = require('./webserver')
var fs = require('fs')
var TZ = null;
TZ = JSON.parse(fs.readFileSync(__dirname + '/timezones.json','utf8'))

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
  "UTC+7": ["Jakarta","Bangkok","Hanoi"],
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
  var y = x + TZ[nick]["offset"];
  if ( y > 23) {
    y -= 12;
  } else if ( y < 0 ) {
    y += 12;
  }
  return y;
}

function getUtc(nick){
  if (TZ[nick].offset == 0) {
    return "UTC"
  } else if (TZ[nick].offset > 0) {
    return "UTC+"+TZ[nick].offset
  } else {
    return "UTC"+TZ[nick].offset
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
    if(args[1] == "dump") {
      bot.say(to,nick+": " + JSON.stringify(TZ));
    } else if(args[1] == "flush") {
      if(args[2] == "force") {
        TZ = JSON.parse(fs.readFileSync(__dirname + '/timezones.json','utf8'))
        bot.say(to,nick+": timezones in memory replaced with the ones on disk");
      } else {
        bot.say(to,nick+": are you sure?")
      }
    } else if(args[1] == "help") {
      bot.say(to, nick + ": !tz to get your current timezone. !tz set <hour> to derive and set your timezone from the hour specified. !tz list to show all personal timezones.")
      return
    }
    if(args[1] == "list" || args[1] == "all") {
      var list = "";
      for (var key in TZ) {
        list = list + pad(getOffset(now.getHours(),key)) + ":" + pad(now.getMinutes()) + " " +  getAcronym(key) + "  "
      }
      bot.say(to, nick + ": " + list + " http://horologicalaffairs.gsi.zuzakistan.com/")
      return
    }
    if(!TZ[nick]) {
      TZ[nick] = {}
    }
    if(args[1] == "set") {
      if(args[2] > -1 && args[2] < 24){
        TZ[nick].offset = args[2] - now.getHours()// - args[2]
        if (TZ[nick].offset > 12) {
          TZ[nick].offset -= 24
        }
      } else {
        bot.say(to, nick + ": invalid time");
      }
    } else if (typeof TZ[nick].offset == undefined){
      TZ[nick]["offset"] = 0
      bot.say(to, nick + ": setting you to UTC.")
    }
    var timezone = getUtc(nick)
    bot.say(to, "It is currently " + pad(getOffset(now.getHours(),nick)) + ':' + pad(now.getMinutes()) + " " + getAcronym(nick) + " (" + timezone + " · " + getPlacename(timezone) + ")");
    fs.writeFileSync('./timezones.json', JSON.stringify(TZ,null,'    '))
  } else if (args[0] == "!france") {
     if (!TZ[nick]){
       bot.say(to, nick + " is not on the roll of the Horological Affairs department.")
       return
    }
    if (places[getUtc(nick)][0] == "literally France") {
      bot.say(to, nick + ": you are literally France");
    } else {
      bot.say(to, nick + ": you are not literally France");
    }
  }
})

function getAcronym(nick) {
    if(!TZ[nick]["timezone"]) {
      var adjectives = Array('Changeable', 'Distorted','Erratic','Fluid','Labile','Mutable','Pliable','Shifting','Unstandard','Vaccilating');
      TZ[nick]["timezone"] = adjectives[Math.floor(Math.random()*adjectives.length)];
      fs.writeFile(__dirname + '/timezones.json', JSON.stringify(TZ,null,'    '), function (err) {
        if (err) {
          console.log(err);
        }
      })
    }
    var ret = nick.toUpperCase().charAt(0) + TZ[nick]["timezone"].charAt(0)
    if (places[getUtc(nick)][0] == "literally France") {
      ret = ret + "F"
    }
    return ret + "T"
}
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
  try {
    var people = {};
    Object.keys(TZ).forEach(function(nick){
      people[nick] = {}
      people[nick]["french"] = (places[getUtc(nick)][0] == "literally France")
      people[nick]["offset"] = TZ[nick]["offset"]
      people[nick]["acronym"] = getAcronym(nick)
      if (TZ[nick]["demonym"]) {
        people[nick]["timezoneName"] = TZ[nick]["demonym"]
      } else {
        people[nick]["timezoneName"] = nick
      }
      people[nick]["timezoneName"] += " " + TZ[nick]["timezone"]
      if(people[nick]["french"]) {
        people[nick]["timezoneName"] += " FRENCH"
      }
      people[nick]["timezoneName"] += " TIME"
      people[nick]["timezoneName"] = people[nick]["timezoneName"].toUpperCase();
    })
    res.json({"version":"2.1.1","denizens":people})
  } catch (e) {
    res.json({"version":"2.1.1","denizens":null,"error":e})
  }
})
