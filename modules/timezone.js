var mediawiki = require('mediawiki-api');
var bot = require('..');
var TZ = 0;
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
function getOffset(x) {
  console.log("TZ = " + TZ);
  var y = x - TZ;
  console.log(y)
  if ( y > 24) {
    y -= 24;
  } else if ( y < 0 ) {
    y += 24;
  }
  return y;
}

function getUtc(){
  if (TZ == 0) {
    return "UTC"
  } else if (TZ > 0) {
    return "UTC-"+TZ;
  } else {
    return "UTC+"+Math.abs(TZ);
  }
}

bot.addListener('message', function (nick, to, text, message) {
  var args = text.split(' ');
  var now = new Date;
  if (args[0] == "!tz") {
    if(args[1] == "help") {
      bot.say(to, nick + ":!tz returns current time in ZPT. Use !tz set <hour> to adjust ZPT to that time.")
      return
    }
    if(args[1] == "set") {
      console.log("hi");
      if(args[2] > -1 && args[2] < 25){
        TZ = now.getHours() - args[2]
        if (TZ > 12) {
          TZ -= 24
        }
        console.log("TZ set to "+ args[2]);
      } else {
        bot.say(to, nick + ": invalid time");
      }
    }
    var hours = "00" + getOffset(now.getHours())
    var mins= "00" + now.getMinutes();
    bot.say(to, "It is currently " + hours.substr(hours.length-2) + ':' + mins.substr(mins.length-2) + " ZPT (" + getUtc() + " · " + places[getUtc()] + ")");
  }
})
