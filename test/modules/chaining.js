/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('commandchaining', function () {
  const tests = {
    '!fw !abv shot 40': '２５ｍｌ　ａｔ　４０％　ＡＢＶ　ｉｓ　１　ｕｎｉｔｓ',
    '!abv !fw shot 40': '25ml at 40% ABV is 1 units',
    '!fw !owo Hello world': '　Ｈｅｗｗｏ　ｗｏｗｗｄ　',
    '!owo !a50': ' Awticwe 50 expiwes in '
  }

  before(function () {
    mockBot.loadModule('abv')
    mockBot.loadModule('countdown')
    mockBot.loadModule('fullwidth')
    mockBot.loadModule('owo')
  })

  let i = 1
  for (const word in tests) {
    it(`chain commands ${i++}`, function () {
      assert(mockBot.runCommand(word).includes(tests[word]))
    })
  }
})
