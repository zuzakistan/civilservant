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
  "UTC-12": "US Minor Outlying Islands",
  "UTC-11": "Hawaii",
  "UTC-10": "Honolulu",
  "UTC-9": "Anchorage",
  "UTC-8": "Los Angeles",
  "UTC-7": "Calgary",
  "UTC-6": "Chicago",
  "UTC-5": "POTUS",
  "UTC-4": "Camp",
  "UTC-3": "Falklands",
  "UTC-2": "South Georgia & South Sandwich Isles",
  "UTC-1": "Azores",
  "UTC": "London",
  "UTC+1": "Berlin",
  "UTC+2": "Athens",
  "UTC+3": "Nairobi",
  "UTC+4": "Dubai",
  "UTC+5": "Tehran",
  "UTC+6": "British Indian Ocean Territory",
  "UTC+7": "Jakarta",
  "UTC+8": "Beijing",
  "UTC+9": "Seoul",
  "UTC+10": "Canberra",
  "UTC+11": "Vladivostok",
  "UTC+12": "Wellington"
}
function getOffset(x,nick) {
  var y = x - TZ[nick];
  if ( y > 24) {
    y -= 24;
  } else if ( y < 0 ) {
    y += 24;
  }
  return y;
}

function getUtc(nick){
  if (TZ[nick] == 0) {
    return "UTC"
  } else if (TZ[nick] > 0) {
    return "UTC-"+TZ[nick];
  } else {
    return "UTC+"+Math.abs(TZ[nick]);
  }
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
      bot.say(to, nick + ": " + list)
      return
    }
    if(args[1] == "set") {
      if(args[2] > -1 && args[2] < 25){
        TZ[nick] = now.getHours() - args[2]
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
    bot.say(to, "It is currently " + pad(getOffset(now.getHours(),nick)) + ':' + pad(now.getMinutes()) + " " + nick.charAt(0).toUpperCase() + "PT (" + getUtc(nick) + " · " + places[getUtc(nick)] + ")");
  }
})

function pad(number) {
  number = "00" + number;
  return number.substr(number.length-2)
}

web.get('/timezones.json', function(req,res){
  
      res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(TZ)
})
