const request = require('request-promise')
const colors = require('irc').colors
var delta = {}
var id = null

module.exports = {
  commands: {
    petition: {
      help: 'Displays information about United Kingdom Parliamentary e-petitions',
      command: async function (bot, msg) {
        if (msg.args[1]) {
          id = msg.args[1]
        }

        try {
          const json = await request.get(`https://petition.parliament.uk/petitions/${id}.json`)
          const data = JSON.parse(json).data

          const old = delta[data.id] ? delta[data.id] : data.attributes.signature_count
          const change = data.attributes.signature_count - old
          delta[data.id] = old + change

          var domestic = 0
          var foreign = 0
          if (data.attributes.signatures_by_country) {
            data.attributes.signatures_by_country.forEach(country => {
              if (country.code === 'GB') {
                domestic += country.signature_count
              } else {
                foreign += country.signature_count
              }
            })
          }
          const ELECTORATE_SIZE = 46800000 // PGE 2017
          const percentageOfElectorate = (domestic / ELECTORATE_SIZE * 100).toPrecision(3) + '%'
          const surplusSignatures = data.attributes.signature_count - domestic - foreign

          let ret
          switch (data.attributes.state) {
            case 'rejected':
              ret = [
                colors.wrap('light_red', data.attributes.rejection.code),
                data.type,
                data.id,
                colors.wrap('white', '"' + data.attributes.action + '"'),
                'https://petition.parliament.uk/petitions/' + data.id
              ]
              break
            case 'closed':
              ret = [
                colors.wrap('dark_red', data.attributes.state),
                data.type,
                data.id,
                colors.wrap('white', '"' + data.attributes.action + '"'),
                'had',
                data.attributes.signature_count.toLocaleString('en-GB'),
                'signatures',
                '·',
                percentageOfElectorate,
                'of electorate',
                '(' + domestic.toLocaleString('en-GB') + ')',
                'plus',
                foreign.toLocaleString('en-GB'),
                'foreign',
                surplusSignatures > 0 ? 'and ' + surplusSignatures.toLocaleString('en-GB') + ' unaccounted for' : null,

                'https://petition.parliament.uk/petitions/' + data.id
              ]
              break
            case 'open':
            default:
              ret = [
                colors.wrap('light_green', data.attributes.state),
                data.type,
                data.id,
                colors.wrap('white', '"' + data.attributes.action + '"'),
                'has',
                data.attributes.signature_count.toLocaleString('en-GB'),
                'signatures',
                colors.wrap('yellow', '(+' + change.toLocaleString('en-GB') + ')'),
                '·',
                percentageOfElectorate,
                'of electorate',
                '(' + domestic.toLocaleString('en-GB') + ')',
                'plus',
                foreign.toLocaleString('en-GB'),
                'foreign',
                surplusSignatures > 0 ? 'and ' + surplusSignatures.toLocaleString('en-GB') + ' unaccounted for' : null,

                'https://petition.parliament.uk/petitions/' + data.id
              ]
          }
          return ret.join(' ')
        } catch (e) {
          return 'err: ' + e
        }
      }
    }
  }
}
