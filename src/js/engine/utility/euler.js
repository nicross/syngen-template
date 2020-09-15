engine.utility.euler = {}

engine.utility.euler.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.utility.euler.prototype = {
  construct: function ({
    pitch = 0,
    roll = 0,
    yaw = 0,
  } = {}) {
    this.pitch = pitch
    this.roll = roll
    this.yaw = yaw
    return this
  },
  isZero: function () {
    return !this.pitch && !this.roll && !this.yaw
  },
  scale: function (scalar = 0) {
    return engine.utility.euler.create({
      pitch: this.pitch * scalar,
      roll: this.roll * scalar,
      yaw: this.yaw * scalar,
    })
  },
  set: function ({
    pitch = 0,
    roll = 0,
    yaw = 0,
  } = {}) {
    this.pitch = pitch
    this.roll = roll
    this.yaw = yaw
    return this
  },
}
