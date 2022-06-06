/**
 * Parses a Minecraft Dynamic Map to return the number of players
 * on a server at the point of the request.
 *
 * bot.config.minecraft.map needs to be set to the root endpoint of
 * the server's map.
 */
const axios = require('axios')
module.exports = {
  commands: {
    minecraft: {
      help: 'Lists current players on a Minecraft server',
      command: async function (bot, msg) {
        const { data } = await axios.get(bot.config.get('minecraft.map') + '/up/world/world/0')
        if (data.players.length !== 0) {
          const ret = []
          for (let i = 0; i < data.players.length; i++) {
            ret.push(data.players[i].name)
          }
          return 'The following players are online: ' + ret.join(' ')
        } else {
          return 'no players online'
        }
      }
    }
  }
}
