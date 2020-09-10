engine.streamer = (() => {
  const registry = new Map(),
    registryTree = engine.utility.quadtree.create(),
    streamed = new Map()

  let currentX,
    currentY,
    shouldForce = false

  function createRegisteredProp(token) {
    if (!registry.has(token)) {
      return
    }

    const {options, prototype} = registry.get(token)
    const prop = engine.props.create(prototype, options)

    streamed.set(token, prop)
  }

  function destroyStreamedProp(token) {
    if (!streamed.has(token)) {
      return
    }

    const prop = streamed.get(token)

    prop.destroy()
    streamed.delete(token)
  }

  function generateToken() {
    let token

    do {
      token = engine.utility.uuid()
    } while (registry.has(token))

    return token
  }

  return {
    cullProp: function (token) {
      const prop = streamed.get(token)

      if (prop) {
        prop.willCull = true
      }

      return this
    },
    deregisterProp: function(token) {
      const registeredProp = registry.get(token)

      if (!registeredProp) {
        return this
      }

      registry.delete(token)
      registryTree.remove(registeredProp)

      return this
    },
    destroyStreamedProp: function (token) {
      destroyStreamedProp(token)
      return this
    },
    getRegisteredProp: (token) => registry.get(token),
    getRegisteredProps: () => registry.values(),
    getStreamedProp: (token) => streamed.get(token),
    getStreamedProps: () => streamed.values(),
    hasRegisteredProp: (token) => registry.has(token),
    hasStreamedProp: (token) => streamed.has(token),
    registerProp: function(prototype, options = {}) {
      const token = generateToken()

      const registeredProp = {
        options: {
          ...options,
          token,
        },
        prototype,
        token,
        x: options.x,
        y: options.y,
      }

      registry.set(token, registeredProp)
      registryTree.insert(registeredProp)

      shouldForce = true

      return token
    },
    reset: function() {
      registry.clear()
      registryTree.clear()

      streamed.forEach((streamedProp) => streamedProp.destroy())
      streamed.clear()

      currentX = null
      currentY = null
      shouldForce = false

      return this
    },
    update: (force = false) => {
      const position = engine.position.get(),
        radius = engine.const.streamerRadius

      if (!force && !shouldForce && currentX === position.x && currentY === position.y) {
        return this
      }

      currentX = position.x
      currentY = position.y
      shouldForce = false

      const nowStreaming = new Set()

      const streamable = [
        ...registryTree.retrieve({
          height: radius * 2,
          width: radius * 2,
          x: currentX - radius,
          y: currentY - radius,
        }).map((registeredProp) => ({
          ...registeredProp,
          distance: engine.utility.distance(position.x, position.y, registeredProp.x, registeredProp.y),
        })),
        ...Array.from(streamed.values()),
      ].filter((prop) => prop.distance <= radius)

      for (const {token} of streamable) {
        if (!streamed.has(token)) {
          createRegisteredProp(token)
        }
        nowStreaming.add(token)
      }

      for (const token of streamed.keys()) {
        if (!nowStreaming.has(token)) {
          destroyStreamedProp(token)
        }
      }

      return this
    },
    updateRegisteredProp: function (token, options = {}) {
      const registeredProp = propRegistry.get(token)

      if (!registeredProp) {
        return this
      }

      registeredProp.options = {
        ...registeredProp.options,
        ...options,
        token,
      }

      return this
    },
  }
})()

engine.loop.on('frame', ({paused}) => {
  if (paused) {
    return
  }

  engine.streamer.update()
})

engine.state.on('reset', () => engine.streamer.reset())
