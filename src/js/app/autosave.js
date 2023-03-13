app.autosave = (() => {
  const autosaveInterval = 30,
    storageKey = 'state'

  let active = false,
    timeout

  function save() {
    app.storage.set(storageKey, engine.state.export())
  }

  function saveLoop() {
    save()
    scheduleSaveLoop()
  }

  function scheduleSaveLoop() {
    timeout = setTimeout(saveLoop, autosaveInterval * 1000)
  }

  return {
    disable: function () {
      active = false

      if (timeout) {
        timeout = clearTimeout(timeout)
      }

      return this
    },
    enable: function () {
      if (active) {
        return this
      }

      active = true
      scheduleSaveLoop()

      return this
    },
    trigger: function () {
      if (active) {
        timeout = clearTimeout(timeout)
      }

      setTimeout(save, 0)

      if (active) {
        scheduleSaveLoop()
      }

      return this
    },
  }
})()
