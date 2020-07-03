'use strict'

engine.audio.binaural.delay = {}

engine.audio.binaural.delay.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.audio.binaural.delay.prototype = {
  construct: function () {
    const context = engine.audio.context()

    this.delayIndex = 0

    this.delay = [
      context.createDelay(),
      context.createDelay(),
    ]

    this.mixer = [
      context.createGain(),
      context.createGain(),
    ]

    this.mixer[0].connect(this.delay[0])
    this.mixer[0].gain.value = 0

    this.mixer[1].connect(this.delay[1])
    this.mixer[1].gain.value = 0

    return this
  },
  destroy: function () {
    this.delay[0].disconnect()
    this.delay[1].disconnect()
    return this
  },
  from: function (input) {
    input.connect(this.mixer[0])
    input.connect(this.mixer[1])
    return this
  },
  to: function (output) {
    this.delay[0].connect(output)
    this.delay[1].connect(output)
    return this
  },
  update: function ({
    delta = 0,
    delayTime = 0,
  } = {}) {
    const nextIndex = this.delayIndex ? 0 : 1

    engine.audio.ramp.set(this.delay[nextIndex].delayTime, delayTime)
    engine.audio.ramp.linear(this.mixer[nextIndex].gain, 1, delta)
    engine.audio.ramp.linear(this.mixer[this.delayIndex].gain, 0, delta)

    this.delayIndex = nextIndex

    return this
  }
}
