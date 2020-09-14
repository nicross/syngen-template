engine.utility.vector2d = {}

engine.utility.vector2d.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

engine.utility.vector2d.prototype = {
  add: function ({
    x = 0,
    y = 0,
  } = {}) {
    return engine.utility.vector2d.create({
      x: this.x + x,
      y: this.y + y,
    })
  },
  angle: function () {
    return Math.atan2(this.y, this.x)
  },
  construct: function ({
    x = 0,
    y = 0,
  } = {}) {
    this.x = x
    this.y = y
    return this
  },
  crossProduct: function ({
    x = 0,
    y = 0,
  } = {}) {
    return (this.x * y) - (this.y * x)
  },
  distance: function ({
    x = 0,
    y = 0,
  } = {}) {
    // TODO: return engine.utility.distance(this, {x, y})
    return Math.sqrt(((this.x - x) ** 2) + ((this.y - y) ** 2))
  },
  distance2: function ({
    x = 0,
    y = 0,
  } = {}) {
    // TODO: return engine.utility.distance2(this, {x, y})
    return ((this.x - x) ** 2) + ((this.y - y) ** 2)
  },
  divide: function (scalar = 0) {
    return engine.utility.vector2d.create({
      x: this.x / scalar,
      y: this.y / scalar,
    })
  },
  dotProduct: function ({
    x = 0,
    y = 0,
  } = {}) {
    return (this.x * x) + (this.y * y)
  },
  equals: function ({
    x = 0,
    y = 0,
  } = {}) {
    return (this.x == x) && (this.y == y)
  },
  multiply: function (scalar = 0) {
    return engine.utility.vector2d.create({
      x: this.x * scalar,
      y: this.y * scalar,
    })
  },
  normalize: function () {
    return this.divide(this.distance())
  },
  rotate: function (angle = 0) {
    return engine.utility.vector2d.create({
      x: this.x * Math.cos(angle),
      y: this.y * Math.sin(angle),
    })
  },
  subtract: function ({
    x = 0,
    y = 0,
  } = {}) {
    return engine.utility.vector2d.create({
      x: this.x - x,
      y: this.y - y,
    })
  },
  subtractRadius: function (radius = 0) {
    if (radius <= 0) {
      return engine.utility.vector2d.create(this)
    }

    const distance = this.distance()

    if (radius >= distance) {
      return engine.utility.vector2d.create()
    }

    return this.multiply(1 - (radius / distance))
  },
}

engine.utility.vector2d.unitX = function () {
  return Object.create(this.prototype).construct({
    x: 1,
  })
}

engine.utility.vector2d.unitY = function () {
  return Object.create(this.prototype).construct({
    y: 1,
  })
}
