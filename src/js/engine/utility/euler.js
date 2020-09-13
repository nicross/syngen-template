engine.utility.euler = {}

engine.utility.euler.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

// TODO: Quaternions, vector3d methods

engine.utility.euler.prototype = {
  add: function ({
    pitch = 0,
    roll = 0,
    yaw = 0,
  } = {}) {
    return engine.utility.euler.create({
      pitch: this.pitch + pitch,
      roll: this.roll + roll,
      yaw: this.yaw + yaw,
    })
  },
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
  divide: function (scalar = 0) {
    return engine.utility.euler.create({
      pitch: this.pitch / scalar,
      roll: this.roll / scalar,
      yaw: this.yaw / scalar,
    })
  },
  multiply: function (scalar = 0) {
    return engine.utility.euler.create({
      pitch: this.pitch * scalar,
      roll: this.roll * scalar,
      yaw: this.yaw * scalar,
    })
  },
  subtract: function ({
    pitch = 0,
    roll = 0,
    yaw = 0,
  } = {}) {
    return engine.utility.euler.create({
      pitch: this.pitch - pitch,
      roll: this.roll - roll,
      yaw: this.yaw - yaw,
    })
  },
}
