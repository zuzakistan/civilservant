const request = require('request-promise')
const moment = require('moment')
const colors = require('irc').colors
const NUMBER_TO_SHOW = 5

module.exports = {
  commands: {
    tram: {
      help: `Shows the next ${NUMBER_TO_SHOW} trams to stop at a Sheffield stop`,
      usage: ['stop'],
      command: async function (bot, msg) {
        const dateStr = moment().format('ddd MMM YYYY HH:mm:ss 0000')
        const url = 'https://tsy.yorkshiretravel.net/lts/departures/' + encodeURIComponent(dateStr)

        /**
         * Stop syntax is the three letter stop code followed by the platform number
         *
         * MAL ----.  2 ->       ________ MHI
         *         |  1 <-      /  -> 2
         *         \___________/   <- 1
         *           CAT   FIZ \
         *                      \_________ HFW
         *                         -> 1
         *                         <- 2
         */

        const stop = {
          id: `9400ZZSY${msg.args.stop.toUpperCase()}`,
          type: 'TRAM_STOP'
        }

        const now = new Date()

        const data = await request(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          json: true,
          body: {
            clientTimeZoneOffsetInMS: 0,
            departureDate: now,
            departureOrArrival: 'DEPARTURE',
            departureTime: now,
            requestTime: now,
            stopId: stop.id,
            stopName: 'Lorem ipsum', // stop.name,
            stopType: stop.type
          }
        })

        if (data.status !== 'SUCCESS') throw new Error(`API error ${data.status} ${data.body.description}`)

        data.body.stopDepartures.splice(NUMBER_TO_SHOW)
        const departures = data.body.stopDepartures

        return departures.map((tram) => {
          const color = {
            BLUE: 'dark_blue',
            PURP: 'light_magenta',
            YELL: 'yellow',
            TT: 'black'
          }[tram.serviceNumber]

          let eta

          if (tram.realTimeDeparture) {
            eta = moment(tram.realTimeDeparture).diff(moment(), 'minutes')
            if (eta === 0) {
              eta = 'Due'
            } else {
              eta = eta + 'min'
            }
          } else {
            eta = moment(tram.scheduledDeparture).format('HH:mm')
          }

          return colors.wrap(color, eta)
        }).join(', ')
      }
    }
  }
}
