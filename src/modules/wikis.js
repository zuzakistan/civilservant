const PROJECTS = {
  'wp': 'wikipedia',
  'wt': 'wiktionary',
  'wq': 'wikiquote',
  'wb': 'wikibooks',
  'ws': 'wikisource',
  'wn': 'wikinews',
  'wv': 'wikiversity',
  'mw': 'mediawiki',
  'wd': 'wikidata'
}

module.exports = {
  commands: {
    wp: {
      help: 'returns a URL to the given Wikimedia project',
      aliases: Object.keys(PROJECTS),
      command: function (bot, msg) {
        var key = msg.args.shift()
        return 'https://en.' + PROJECTS[key] + '.org/wiki/' + encodeURIComponent(msg.args.join(' '))
      }
    }
  }
}
