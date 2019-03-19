module.exports = {
  commands: {
    q: {
      help: 'does nothing interesting',
      command: function () {
        return 'this ambiguous command has been removed, try !quote or !question instead'
      }
    }
  }
}
