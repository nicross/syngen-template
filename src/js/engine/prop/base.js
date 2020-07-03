'use strict'

engine.prop.base = {
  construct: function ({
    angle = 0,
    output = engine.audio.mixer.bus.props(),
    radius = 0,
    x = 0,
    y = 0,
    ...options
  } = {}) {
    const context = engine.audio.context()

    this.acceleration = 0
    this.accelerationDelta = 0
    this.angle = angle
    this.angleDelta = 0
    this.jerk = 0
    this.jerkDelta = 0
    this.radius = radius
    this.shouldCull = false
    this.spawnAngle = this.angle
    this.spawnX = x
    this.spawnY = y
    this.velocity = 0
    this.velocityDelta = 0
    this.willCull = false
    this.x = x
    this.y = y

    this.output = {
      binaural: engine.audio.binaural.create(),
      input: context.createGain(),
      reverb: engine.audio.send.reverb.create(),
    }

    this.output.binaural.from(this.output.input)
    this.output.binaural.to(output)

    this.output.reverb.from(this.output.input)

    this.output.input.gain.value = engine.const.zeroGain
    engine.audio.ramp.linear(this.output.input.gain, 1, engine.const.propFadeDuration)

    this.recalculate()
    this.onConstruct(options)

    return this
  },
  destroy: function () {
    engine.audio.ramp.linear(this.output.input.gain, engine.const.zeroGain, engine.const.propFadeDuration)

    setTimeout(() => {
      this.output.input.disconnect()
      this.output.binaural.destroy()
      this.output.reverb.destroy()
      this.onDestroy()
    }, engine.const.propFadeDuration * 1000)

    return this
  },
  onConstruct: () => {},
  onDestroy: () => {},
  onUpdate: () => {},
  rect: function () {
    return {
      height: this.radius * 2,
      width: this.radius * 2,
      x: this.x - this.radius,
      y: this.y - this.radius,
    }
  },
  recalculate: function (delta = 0) {
    const position = engine.position.get(),
      relative = engine.utility.toRelativeCoordinates(position, this)

    this.atan2 = Math.atan2(this.y - position.y, this.x - position.x)
    this.distance = engine.utility.distanceRadius(position.x, position.y, this.x, this.y, this.radius)

    this.output.binaural.update({
      delta,
      ...relative,
    })

    this.output.reverb.update({
      delta,
      ...relative,
    })

    return this
  },
  update: function ({
    delta,
    paused,
  } = {}) {
    this.onUpdate.apply(this, arguments)

    if (!paused) {
      if (this.angleDelta) {
        this.angle = engine.utility.normalizeAngle(this.angle + this.angleDelta)
        this.angleDelta = 0
      }

      if (this.jerkDelta) {
        this.jerk += this.jerkDelta
        this.jerkDelta = 0
      }

      if (this.jerk) {
        this.accelerationDelta = (this.accelerationDelta || 0) + this.jerk
      }

      if (this.accelerationDelta) {
        this.acceleration += this.accelerationDelta
        this.accelerationDelta = 0
      }

      if (this.acceleration) {
        this.velocityDelta = (this.velocityDelta || 0) + this.acceleration
      }

      if (this.velocityDelta) {
        this.velocity += this.velocityDelta
        this.velocityDelta = 0
      }

      if (this.velocity) {
        this.x += Math.cos(this.angle) * this.velocity * delta
        this.y += Math.sin(this.angle) * this.velocity * delta
      }

      this.recalculate(delta)
    }

    return this
  },
}
