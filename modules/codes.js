var langs = require('languages')
var countries = require('i18n-iso-countries')
var states = require('us-states')
var airports = require('airport-lookup')
var currencies = require('currency-codes')

module.exports = {
  commands: {
    airport: {
      help: 'Looks up an IATA airport code',
      usage: ['code'],
      command: function (bot, msg) {
        var data = airports(msg.args.code)
        if (data) {
          var datum = [data.size, countries.getName(data.iso, 'en'), data.type]
          return data.iata + ': ' + data.name + ' (' + datum.join(' ') + ')'
        }
        return 'Unable to find an airport with IATA code ' + msg.args.code
      }
    },
    currency: {
      help: 'Looks up an ISO 4217 currency code',
      usage: ['currency'],
      command: function (bot, msg) {
        var code = currencies.code(msg.args.currency)
        if (code) {
          if (code.countries) {
            return code.code + ' → ' + code.currency + ' (' + code.countries.join(', ') + ')'
          }
          return code.code + ' → ' + code.currency
        }
        return 'ISO code not found.'
      }
    },
    lang: {
      help: 'Looks up an ISO 369-1 language code',
      aliases: ['language'],
      usage: ['lang'],
      command: function (bot, msg) {
        msg.args.lang = msg.args.lang.toLowerCase()
        if (langs.isValid(msg.args.lang)) {
          var info = langs.getLanguageInfo(msg.args.lang)
          return msg.args.lang + ' → ' + info.name + ' · ' + info.nativeName
        }
        return 'Invalid ISO 639-1 code.'
      }
    },
    country: {
      help: 'Looks up an ISO 3166 alpha2 country code',
      usage: ['country'],
      command: function (bot, msg) {
        var code = msg.args.country.toUpperCase()
        let languages = ['en', 'de', 'fr', 'el']
        if (countries.getName(code, 'en')) {
          return code + ' → ' + languages.map((lang) => countries.getName(code, lang)).join(' · ')
        }
        return 'ISO 3166-alpha2 code not found.'
      }
    },
    cc: {
      help: 'Looks up an ISO 3166 alpha2 country code',
      usage: ['country', 'language'],
      aliases: ['cc'],
      command: function (bot, msg) {
        const code = msg.args.country.toUpperCase()
        const lang = msg.args.language.toLowerCase()
        return code + ' → ' + (countries.getName(code, lang) || 'not found')
      }
    },
    state: {
      help: 'Looks up a US state from its postal abbbreviation',
      usage: ['code'],
      command: function (bot, msg) {
        var code = msg.args.code.toUpperCase()
        if (states[code]) {
          return code + ' → ' + states[code]
        }
        return 'USPS code not found'
      }
    }
  }
}
