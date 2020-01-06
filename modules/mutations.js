/**
 * Applies a Welsh soft mutation to a given string.
 */
module.exports = {
  commands: {
    soft: {
      aliases: ['mutate', 'treglad', 'meddal'],
      help: 'Mutates a given word',
      usage: ['type', 'radical'],
      command: function (bot, msg) {
        /* TODO: uppercase */
        var initial = msg.args.radical.charAt(0)
        var rest = msg.args.radical.substr(1)
        switch (msg.args.type.toUpperCase()) {
          case 'ASPIRATE':
          case 'LLAES':
          case 'A':
          case 'LL':
          case 'L':
          case 'AC':
            switch (initial) {
              case 'p':
                return 'ph' + rest
              case 't':
                return 'th' + rest
              case 'c':
                return 'ch' + rest
            }
            break /* not actually needed, but hey */

          case 'NASAL':
          case 'TRWYNOL':
          case 'N':
          case 'T':
          case 'YN':
          case 'FY':
            switch (initial) {
              case 'p':
                return 'mh' + rest
              case 't':
                return 'nh' + rest
              case 'c':
                return 'ngh' + rest
              case 'b':
                return 'm' + rest
              case 'd':
                return 'n' + rest
              case 'g':
                return 'ng' + rest
            }
            break

          case 'SOFT':
          case 'MEDDIAL':
          case 'S':
          case 'M':
            switch (initial) {
              /*  G LlMRh */
              case 'p':
                return 'b' + rest
              case 't':
                return 'd' + rest
              case 'c':
                return 'g' + rest
              case 'b':
              case 'm':
                return 'f' + rest
              case 'd':
                return 'dd' + rest
              case 'g':
                return rest
              case 'l':
                if (rest.charAt(0) === 'l') {
                  return rest
                }
                break
              case 'r':
                if (rest.charAt(0) === 'h') {
                  return 'r' + rest.substr(1)
                }
            }
            break

          default:
            return [
              'Usage: (soft|nasal|aspirate) <radical>',
              'Defnydd: (meddial|trwynol|llaes) <radical>'
            ]
        }
        return msg.args.radical
      }
    }
  }
}
