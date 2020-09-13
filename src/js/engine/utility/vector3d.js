engine.utility.vector3d = {}

engine.utility.vector3d.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.utility.vector3d.prototype = {
  add: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return engine.utility.vector3d.create({
      x: this.x + x,
      y: this.y + y,
      z: this.z + z,
    })
  },
  construct: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    this.x = x
    this.y = y
    this.z = z
    return this
  },
  crossProduct: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return engine.utility.vector3d.create({
      x: (this.y * z) - (this.z * y),
      y: (this.z * x) - (this.x * z),
      z: (this.x * y) - (this.y * x),
    })
  },
  distance: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    // TODO: return engine.utility.distance(this, {x, y, z})
    return Math.sqrt(((this.x - x) ** 2) + ((this.y - y) ** 2) + ((this.z - z) ** 2))
  },
  distance2: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    // TODO: return engine.utility.distance2(this, {x, y, z})
    return ((this.x - x) ** 2) + ((this.y - y) ** 2) + ((this.z - z) ** 2)
  },
  divide: function (scalar = 0) {
    return engine.utility.vector3d.create({
      x: this.x / scalar,
      y: this.y / scalar,
      z: this.z / scalar,
    })
  },
  dotProduct: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return (this.x * x) + (this.y * y) + (this.z * z)
  },
  equals: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return (this.x == x) && (this.y == y) && (this.z == z)
  },
  multiply: function (scalar = 0) {
    return engine.utility.vector3d.create({
      x: this.x * scalar,
      y: this.y * scalar,
      z: this.z * scalar,
    })
  },
  normalize: function () {
    return this.divide(this.distance())
  },
  rotateEuler: function (euler, sequence) {
    return this.rotateQuaternion(
      engine.utility.quaternion.fromEuler(euler, sequence)
    )
  },
  rotateQuaternion: function (quaternion) {
    if (!engine.utility.quaternion.prototype.isPrototypeOf(quaternion)) {
      quaternion = engine.utility.quaternion.create(quaternion)
    }

    return engine.utility.vector3d.create(
      quaternion.multiply(
        engine.utility.quaternion.create(this)
      ).multiply(
        quaternion.inverse()
      )
    )
  },
  subtract: function ({
    x = 0,
    y = 0,
    z = 0,
  } = {}) {
    return engine.utility.vector3d.create({
      x: this.x - x,
      y: this.y - y,
      y: this.z - z,
    })
  },
}

engine.utility.vector3d.unitX = function (...args) {
  return Object.create(this.prototype).construct({
    x: 1,
  })
}

engine.utility.vector3d.unitY = function (...args) {
  return Object.create(this.prototype).construct({
    y: 1,
  })
}

engine.utility.vector3d.unitZ = function (...args) {
  return Object.create(this.prototype).construct({
    z: 1,
  })
}
