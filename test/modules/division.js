/* eslint-env mocha */
const mockBot = require('../mockBot')
const assert = require('assert')
const sinon = require('sinon')

const momentProto = require('moment').fn

let sandbox = sinon.sandbox.create()

describe('division module', function () {
  before(function () {
    mockBot.loadModule('division')
  })

  it('should say 8pm on Mondays', function () {
    sandbox.stub(momentProto, 'day')
    sandbox.stub(momentProto, 'isBefore')
    momentProto.day.returns(1)
    momentProto.isBefore.returns(false)

    assert.ok(mockBot.runCommand('!division').match(/8:00 pm/))

    sandbox.restore()
  })

  it('should say 7pm on Tuesdays', function () {
    sandbox.stub(momentProto, 'day')
    sandbox.stub(momentProto, 'isBefore')
    momentProto.day.returns(2)
    momentProto.isBefore.returns(false)

    assert.ok(mockBot.runCommand('!division').match(/7:00 pm/))
    sandbox.restore()
  })

  it('should say 7pm on Wednesdays', function () {
    sandbox.stub(momentProto, 'day')
    sandbox.stub(momentProto, 'isBefore')
    momentProto.day.returns(3)
    momentProto.isBefore.returns(false)

    assert.ok(mockBot.runCommand('!division').match(/7:00 pm/))

    sandbox.restore()
  })

  it('should say 5pm on Thursdays', function () {
    sandbox.stub(momentProto, 'day')
    sandbox.stub(momentProto, 'isBefore')
    momentProto.day.returns(4)
    momentProto.isBefore.returns(false)

    assert.ok(mockBot.runCommand('!division').match(/5:00 pm/))
    sandbox.restore()
  })

  it('should say no interruption on Fridays', function () {
    sandbox.stub(momentProto, 'day')
    sandbox.stub(momentProto, 'isBefore')
    momentProto.day.returns(5)
    momentProto.isBefore.returns(false)

    assert.ok(mockBot.runCommand('!division').match(/no moment of interruption/))
    sandbox.restore()
  })

  it('should say interruption has passed if it has', function () {
    sandbox.stub(momentProto, 'day')
    sandbox.stub(momentProto, 'isBefore')
    momentProto.day.returns(1)
    momentProto.isBefore.returns(true)

    assert.strictEqual(mockBot.runCommand('!division'), 'moment of interruption has passed')
    sandbox.restore()
  })
})
