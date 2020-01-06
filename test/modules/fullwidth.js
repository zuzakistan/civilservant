/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')

describe('fullwidthmodule', function () {
  const tests = {
    /* eslint-disable quote-props */
    'abcdefghijklmnopqrstuvwxyz': 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ',
    'ABCDEFGHIJKLMNOPQRSTUVWYXZ': 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＹＸＺ',
    '0123456789': '０１２３４５６７８９',
    '!"#$%&\'()*+,-./': '！＂＃＄％＆＇（）＊＋，－．／',
    '¢£¥¦¬¯₩': '￠￡￥￤￢￣￦',
    '¡aBc¥': '¡ａＢｃ￥'
    /* eslint-enable quote-props */
  }

  before(function () {
    mockBot.loadModule('fullwidth')
  })

  let i = 1
  for (const word in tests) {
    it(`be aesthetic ${i++}`, function () {
      assert.strictEqual(mockBot.runCommand(`!fullwidth ${word}`), tests[word])
    })
  }
})
