/**
 * Parses a Minecraft Dynamic Map to return the number of players
 * on a server at the point of the request.
 *
 * bot.config.minecraft.map needs to be set to the root endpoint of
 * the server's map.
 */
var request = require('request')
module.exports = {
  commands: {
    minecraft: {
      help: 'Lists current players on a Minecraft server',
      command: function (bot, msg) {
        request.get(bot.config.minecraft.map + '/up/world/world/0', function (e, r, b) {
          if (e) {
            bot.say(msg.to, 'problem fetching data')
          }
          if (r.statusCode !== 200) {
            bot.say(msg.to, 'problem fetching data (' + r.statusCode + ')')
          }
          var data = JSON.parse(b)
          if (data.players.length !== 0) {
            var ret = []
            for (var i = 0; i < data.players.length; i++) {
              ret.push(data.players[i].name)
            }
            bot.say(msg.to, 'The following players are online: ' + ret.join(' '))
          } else {
            bot.say(msg.to, 'no players online')
          }
        })
      }
    }
  }
}
