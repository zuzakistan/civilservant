/**
 * For ISO code lookups from NPM modules, see languages.js
 *
 * Scrapes iso.org's search page to map ISO number (e.g. 9001)
 * to name (e.g. Quality management systems -- Requirements).
 */
const scrape = require('scrape')
module.exports = {
  commands: {
    iso: {
      help: 'Looks up an ISO specification from number',
      usage: ['number'],
      command: function (bot, msg) {
        const url = 'http://www.iso.org/iso/home/search/extendedsearchstandards.htm?type=adv&published=on&formStage_code=&formDate_stage=0&formISO_number='
        scrape.request(url + msg.args.number, function (err, $) {
          if (err) {
            return
          }
          $('div.result').each(function (result) {
            const number = result.find('h4 a').first().text
            const title = result.find('p').first().text
            bot.say(msg.to, msg.nick + ': ' + number + ': ' + title)
          })
        })
      }
    }
  }
}
