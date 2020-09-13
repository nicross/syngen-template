engine.position = (() => {
  const defaults = {
    angle: 0,
    x: 0,
    y: 0,
    z: 0,
  }

  let state = {...defaults}

  return {
    get: () => ({...state}),
    rect: () => ({
      depth: engine.const.positionRadius * 2,
      height: engine.const.positionRadius * 2,
      width: engine.const.positionRadius * 2,
      x: state.x - engine.const.positionRadius,
      y: state.y - engine.const.positionRadius,
      z: state.z - engine.const.positionRadius,
    }),
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
    vector: () => engine.utility.vector3d.create(state),
  }
})()

engine.state.on('export', (data = {}) => data.position = engine.position.get())
engine.state.on('import', (data = {}) => engine.position.set(data.position))
engine.state.on('reset', () => engine.position.reset())
