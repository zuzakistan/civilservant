var bot = require('..');
var web = require('./webserver')
var activity = {}

bot.addListener('message', function (nick, to, text, message) {
  var now = new Date()
  activity[to] = {nick:nick,message:text,time:now.getTime()}
})


web.get('/activity.json', function(req,res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(activity);
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
