var request = require('request')
var delta = {}
var id = null

module.exports = {
  commands: {
    petition: {
      help: 'Displays information about United Kingdom Parliamentary e-petitions',
      command: function (bot, msg) {
        if (msg.args[1]) {
          id = msg.args[1]
        }

        request.get('https://petition.parliament.uk/petitions/' + id + '.json', function (e, r, b) {
          if (e) {
            return 'problem fetching data'
          }
          if (r.statusCode !== 200) {
            return 'problem fetching data (' + r.statusCode + ')'
          }
          var data = JSON.parse(b).data

          var old = delta[data.id] ? delta[data.id] : data.attributes.signature_count
          var change = data.attributes.signature_count - old
          delta[data.id] = old + change

          var domestic = 0
          var foreign = 0
          for (var i = 0; i < data.attributes.signatures_by_country.length; i++) {
            if (data.attributes.signatures_by_country[i].code === 'GB') {
              domestic += data.attributes.signatures_by_country[i].signature_count
            } else {
              foreign += data.attributes.signatures_by_country[i].signature_count
            }
          }
          var ret = [
            data.attributes.state,
            data.type,
            data.id,
            '"' + data.attributes.action + '"',
            'has',
            data.attributes.signature_count.toLocaleString('en-GB'),
            'signatures',
            '(+' + change + ')',
            '[' + domestic,
            foreign,
            (data.attributes.signature_count - domestic - foreign) + ']',

            'https://petition.parliament.uk/petitions/' + data.id
          ]
          bot.say(msg.to, ret.join(' '))
        })
      }
    }
  }
}
