engine.prop.base = {
  name: 'base',
  construct: function ({
    angle = 0,
    destination = engine.audio.mixer.bus.props(),
    radius = 0,
    token,
    x = 0,
    y = 0,
    z = 0,
    ...options
  } = {}) {
    const context = engine.audio.context()

    this.acceleration = 0
    this.accelerationDelta = 0
    this.angle = angle
    this.angleDelta = 0
    this.instantiated = true
    this.jerk = 0
    this.jerkDelta = 0
    this.periodic = {}
    this.radius = radius
    this.shouldCull = false
    this.spawnAngle = this.angle
    this.spawnX = x
    this.spawnY = y
    this.spawnZ = z
    this.token = token
    this.velocity = 0
    this.velocityDelta = 0
    this.willCull = false
    this.x = x
    this.y = y
    this.z = z

    this.binaural = engine.audio.binaural.create()
    this.output = context.createGain()
    this.reverb = engine.audio.send.reverb.create()

    this.binaural.from(this.output)
    this.binaural.to(destination)

    this.reverb.from(this.output)

    this.output.gain.value = engine.const.zeroGain
    engine.audio.ramp.linear(this.output.gain, 1, engine.const.propFadeDuration)

    this.recalculate()
    this.onConstruct(options)

    return this
  },
  destroy: function () {
    engine.audio.ramp.linear(this.output.gain, engine.const.zeroGain, engine.const.propFadeDuration)

    setTimeout(() => {
      this.output.disconnect()
      this.binaural.destroy()
      this.reverb.destroy()
      this.onDestroy()
    }, engine.const.propFadeDuration * 1000)

    return this
  },
  invent: function (definition = {}) {
    if (typeof definition == 'function') {
      definition = definition(this)
    }

    return Object.setPrototypeOf({...definition}, this)
  },
  handlePeriodic: function ({
    delay = () => 0,
    key = '',
    trigger = () => Promise.resolve(),
  } = {}) {
    if (!(key in this.periodic)) {
      this.periodic[key] = {
        active: false,
        timer: delay() * Math.random(),
      }
    }

    const periodic = this.periodic[key]

    if (periodic.active) {
      return this
    }

    if (periodic.timer < 0) {
      periodic.timer = delay()
    }

    periodic.timer -= engine.loop.delta()

    if (periodic.timer <= 0) {
      const result = trigger() || Promise.resolve()
      periodic.active = true
      periodic.timer = -Infinity // XXX: Force delay() next inactive frame
      result.then(() => periodic.active = false)
    }

    return this
  },
  hasPeriodic: function (key) {
    return key in this.periodic
  },
  isPeriodicActive: function (key) {
    return this.periodic[key] && this.periodic[key].active
  },
  isPeriodicPending: function (key) {
    return this.periodic[key] && !this.periodic[key].active
  },
  onConstruct: () => {},
  onDestroy: () => {},
  onUpdate: () => {},
  recalculate: function () {
    const position = engine.position.get()

    this.relative = engine.utility.vector3d.create(this)
      .subtract(position)
      .subtractRadius(this.radius)
      .rotateEuler({
        pitch: -position.pitch,
        roll: -position.roll,
        yaw: -position.yaw,
      })

    this.distance = this.relative.distance()

    this.binaural.update({...this.relative})
    this.reverb.update({...this.relative})

    return this
  },
  rect: function () {
    return {
      height: this.radius * 2,
      width: this.radius * 2,
      x: this.x - this.radius,
      y: this.y - this.radius,
    }
  },
  resetPeriodic: function (key) {
    delete this.periodic[key]
    return this
  },
  update: function ({
    delta,
    paused,
  } = {}) {
    this.onUpdate.apply(this, arguments)

    if (paused) {
      return this
    }

    if (this.angleDelta) {
      this.angle += this.angleDelta
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

    this.recalculate()

    return this
  },
}
