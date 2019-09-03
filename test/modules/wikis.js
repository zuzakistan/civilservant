/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('wikis module', function () {
  const WIKIS = {
    wp: 'wikipedia',
    wt: 'wiktionary',
    wq: 'wikiquote',
    wb: 'wikibooks',
    ws: 'wikisource',
    wn: 'wikinews',
    wv: 'wikiversity',
    mw: 'mediawiki',
    wd: 'wikidata'
  }

  before(function () {
    mockBot.loadModule('wikis')
    Object.keys(WIKIS).forEach(function (key) {
      if (key !== 'wp') {
        mockBot.commands[key] = mockBot.commands.wp
      }
    })
  })

  after(function () {
    Object.keys(WIKIS).forEach(function (key) {
      if (key !== 'wp') {
        delete mockBot.commands[key]
      }
    })
  })

  Object.keys(WIKIS).forEach(function (key) {
    const name = WIKIS[key]
    it('should link to english ' + name, function () {
      assert.strictEqual(mockBot.runCommand(`!${key}`), `https://en.${name}.org/wiki/`)
    })

    it('should link to english ' + name + ' with an argument', function () {
      assert.strictEqual(mockBot.runCommand(`!${key} hello`), `https://en.${name}.org/wiki/hello`)
    })

    it('should link to english ' + name + ' with arguments', function () {
      assert.strictEqual(mockBot.runCommand(`!${key} hello world`), `https://en.${name}.org/wiki/hello%20world`)
    })
  })
})
