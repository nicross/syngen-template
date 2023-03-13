app.controls.gamepad = {
  game: function (mappings) {
    const state = {}

    const isDigital = (value, mapping) => {
      return value || (mapping.type == 'gamepad' && engine.input.gamepad.isDigital(mapping.key))
    }

    const getAnalog = (value, mapping) => {
      if (mapping.type != 'gamepad') {
        return value
      }

      const analogValue = engine.input.gamepad.getAnalog(mapping.key)

      return Math.max(value, analogValue)
    }

    const getAxis = (value, mapping) => {
      if (mapping.type != 'gamepad') {
        return value
      }

      const measure = engine.input.gamepad.getAxis(mapping.key)
      return Math.abs(measure) > Math.abs(value) ? measure : value
    }

    // Axes
    for (const [mapping, name] of Object.entries({
      moveAxis: 'x',
      strafeAxis: 'y',
      turnAxis: 'rotate',
    })) {
      const axisValue = mappings[mapping].reduce(getAxis, 0)

      if (axisValue) {
        state[name] = axisValue
      }
    }

    // XXX: Invert some axes to align with keyboard controls
    for (const key of [
      'rotate',
      'x',
      'y',
    ]) {
      if (state[key]) {
        state[key] = -state[key]
      }
    }

    // Forward/backward analog
    const moveBackward = mappings.moveBackward.reduce(getAnalog, 0),
      moveForward = mappings.moveForward.reduce(getAnalog, 0)

    if (moveBackward && !moveForward) {
      state.x = Math.min(state.x || 0, -moveBackward)
    }

    if (moveForward && !moveBackward) {
      state.x = Math.max(state.x || 0, moveForward)
    }

    return state
  },
  ui: function (mappings) {
    const state = {}

    const getAxis = (value, mapping) => {
      if (mapping.type != 'gamepad') {
        return value
      }

      const measure = engine.input.gamepad.getAxis(mapping.key)
      return Math.abs(measure) > Math.abs(value) ? measure : value
    }

    const isDigital = (value, mapping) => {
      return value || (mapping.type == 'gamepad' && engine.input.gamepad.isDigital(mapping.key))
    }

    // Up / down / left / right
    let x = mappings.uiAxisHorizontal.reduce(getAxis, 0),
      y = mappings.uiAxisVertical.reduce(getAxis, 0)

    if (mappings.uiUp.reduce(isDigital, false)) {
      y = -1
    }

    if (mappings.uiDown.reduce(isDigital, false)) {
      y = 1
    }

    if (mappings.uiLeft.reduce(isDigital, false)) {
      x = -1
    }

    if (mappings.uiRight.reduce(isDigital, false)) {
      x = 1
    }

    const absX = Math.abs(x),
      absY = Math.abs(y)

    if (absX - absY >= 0.125) {
      if (x < 0) {
        state.left = true
      } else {
        state.right = true
      }
    } else if (absY - absX >= 0.125) {
      if (y < 0) {
        state.up = true
      } else {
        state.down = true
      }
    }

    // Buttons
    for (const [mapping, name] of Object.entries({
      back: 'back',
      confirm: 'confirm',
      pause: 'pause',
      start: 'start',
    })) {
      if (mappings[mapping].reduce(isDigital, false)) {
        state[name] = true
      }
    }

    return state
  },
}
