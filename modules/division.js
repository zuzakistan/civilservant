const moment = require('moment')

module.exports = {
  commands: {
    division: {
      help: 'computes moment of interruption for today\'s House of Commons business',
      command: function () {
        const now = moment()
        let timeOfInterruption = null // SO9(3) https://publications.parliament.uk/pa/cm201516/cmstords/1154/body.htm#9

        const dayOfWeek = now.day()

        switch (dayOfWeek) {
          case 1: // Mon
            timeOfInterruption = { hour: 22, minute: 0 }
            break
          case 2: // Tue
          case 3: // Wed
            timeOfInterruption = { hour: 19, minute: 0 }
            break
          case 4: // Thurs
            timeOfInterruption = { hour: 17, minute: 0 }
        }

        if (!timeOfInterruption) return 'no moment of interruption on ' + now.format('dddd')

        let dateOfInterruption = now
        dateOfInterruption.set(timeOfInterruption)

        if (dateOfInterruption.isBefore(now)) return 'moment of interruption has passed'

        return `moment of interruption is ${dateOfInterruption.fromNow()} (${dateOfInterruption.format('h:mm a')})`
      }
    },
    // these following are only valid for the 2017 to 2019 Parliamentary session:
    orderpaper: {
      aliases: [ 'op', 'cop', 'corderpaper' ],
      help: 'generates link to today\'s Commons order paper',
      command: () => {
        const ts = moment().format('YYMMDD') // e.g. OP190321.pdf
        return `https://publications.parliament.uk/pa/cm201719/cmagenda/OP${ts}.pdf`
      }
    },
    business: {
      help: 'generates link to today\'s Commons business',
      aliases: [ 'cbusiness' ],
      command: () => {
        const ts = moment().format('YYMMDD')
        return `https://publications.parliament.uk/pa/cm201719/cmagenda/ob${ts}.htm`
      }
    },
    future: {
      help: 'generates link to Commons future business',
      aliases: [ 'futurebusiness' ],
      command: () => {
        const ts = moment().format('YYMMDD')
        return `https://publications.parliament.uk/pa/cm201719/cmagenda/fb${ts}.htm`
      }
    },
    lbusiness: {
      help: 'generates link to today\'s Lords business',
      command: () => {
        const ts = moment().format('YYYY-MM-DD')
        return 'https://lordsbusiness.parliament.uk/?businessPaperDate=' + ts
      }
    }
  }
}
