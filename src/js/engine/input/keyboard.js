engine.input.keyboard = (() => {
  let state = {}

  window.addEventListener('keydown', onKeydown)
  window.addEventListener('keyup', onKeyup)

  function onKeydown(e) {
    if (e.repeat) {
      return
    }

    state[e.which] = true
  }

  function onKeyup(e) {
    state[e.which] = false
  }

  return {
    get: () => ({...state}),
    is: (key) => state[key] || false,
    reset: function () {
      state = {}
      return this
    },
  }
})()
