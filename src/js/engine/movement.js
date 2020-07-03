'use strict'

engine.movement = (() => {
  const defaults = {
    angle: 0,
    deltaRotation: 0,
    deltaVelocity: 0,
    rotation: 0,
    velocity: 0,
  }

  // TODO: Move to engine.const
  const acceleration = {
    rotation: Math.PI,
    velocity: 1,
  }

  // TODO: Move to engine.const
  const deceleration = {
    rotation: Math.PI,
    velocity: 2,
  }

  let state = {...defaults}

  return {
    get: () => ({...state}),
    reset: function () {
      return this.set()
    },
    set: function (values = {}) {
      state = {
        ...defaults,
        ...values,
      }

      return this
    },
    update: function ({rotate, translate}) {
      const delta = engine.loop.delta()

      const maxRotation = Math.min(Math.abs(engine.const.movementMaxRotation * rotate), engine.const.movementMaxRotation),
        maxVelocity = Math.min(engine.const.movementMaxVelocity * translate.radius, engine.const.movementMaxVelocity)

      if (translate.radius > 0) {
        if (state.velocity <= maxVelocity - (delta * acceleration.velocity)) {
          state.velocity += delta * acceleration.velocity
        } else if (state.velocity > maxVelocity) {
          state.velocity -= delta * deceleration.velocity
        }
      } else if (state.velocity >= delta * deceleration.velocity) {
        state.velocity -= delta * deceleration.velocity
      } else if (state.velocity != 0) {
        state.velocity = 0
      }

      if (rotate > 0) {
        if (state.rotation < maxRotation) {
          state.rotation += delta * acceleration.rotation * rotate
        }
      } else if (rotate < 0) {
        if (state.rotation > -maxRotation) {
          state.rotation += delta * acceleration.rotation * rotate
        }
      } else if (state.rotation >= deceleration.rotation) {
        state.rotation -= delta * deceleration.rotation
      } else if (state.rotation <= -deceleration.rotation) {
        state.rotation += delta * deceleration.rotation
      } else if (state.rotation != 0) {
        state.rotation = 0
      }

      if (translate.radius) {
        state.angle = translate.theta
      }

      state.deltaRotation = delta * state.rotation
      state.deltaVelocity = delta * state.velocity

      return this
    },
  }
})()

engine.state.on('reset', () => engine.movement.reset())
