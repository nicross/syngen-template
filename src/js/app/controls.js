app.controls = (() => {
  const gameDefaults = {
    rotate: 0,
    x: 0,
    y: 0,
    z: 0,
  }

  let gameCache = {...gameDefaults},
    uiCache = {},
    uiDelta = {}

  function updateGame() {
    const mappings = app.controls.mappings

    gameCache = {
      ...gameDefaults,
      ...app.controls.gamepad.game(mappings),
      ...app.controls.keyboard.game(mappings),
      ...app.controls.mouse.game(mappings),
    }
  }

  function updateUi() {
    const mappings = app.controls.mappings

    const values = {
      ...app.controls.gamepad.ui(mappings),
      ...app.controls.keyboard.ui(mappings),
      ...app.controls.mouse.ui(mappings),
    }

    uiDelta = {}

    for (const key in values) {
      if (!(key in uiCache)) {
        uiDelta[key] = values[key]
      }
    }

    uiCache = values
  }

  return {
    game: () => ({...gameCache}),
    ui: () => ({...uiDelta}),
    reset: function () {
      gameCache = {}
      uiCache = {}
      uiDelta = {}

      return this
    },
    update: function () {
      updateGame()
      updateUi()

      return this
    },
  }
})()

engine.loop.on('frame', () => app.controls.update())
