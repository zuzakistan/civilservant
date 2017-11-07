var imdb = require('imdb-api')
module.exports = {
  events: {
    'url:imdb.com': function (bot, url, nick, to) {
      var id = url.pathname.split('/').pop()
      imdb.getReq({ id }, function (err, movie) {
        if (err) {
          throw err
        }
        bot.shout(to, [
          movie.title,
          '(' + movie._year_data + ',',
          movie.runtime + ')',
          '·',
          movie.rated,
          movie.type,
          'with rating',
          movie.rating,
          '[' + movie.metascore + '].',
          movie.awards
        ].join(' '))
      })
    }
  }
}
