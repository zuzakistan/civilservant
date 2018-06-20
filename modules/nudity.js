var request = require('request')
var nude = require('nudity')
module.exports = {
  events: {
    'url:i.imgur.com': function (bot, url, nick, to) {
      var path = url.path
      /*
       * The script hangs on large images, so rely on Imgur to play nice.
       * Appending "l" to a filename forces it to be a large thumbnail.
       */
      path = url.path.split('.')
      if (path[1] === 'jpg' || path[1] === 'gif') {
        path = path[0] + 'l.' + path[1]
      } else {
        return
      }
      request({
        url: url.protocol + '//' + url.host + path,
        headers: {
          accept: 'image/jpeg'
        },
        encoding: null // we want binary
      }, function (err, res, body) {
        if (err) {
          throw err
        }
        nude.scanData(body, function (err, red) {
          if (err) {
            return
          }
          if (red) {
            bot.shout(to, nick + ': lewd')
          }
        })
      })
    }
  }
}
