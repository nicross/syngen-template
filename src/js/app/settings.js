app.settings = (() => {
  const storageKey = 'settings'

  const computed = {},
    helpers = {},
    raw = {},
    settings = {}

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  function compute(key, value) {
    const computer = settings[key].compute

    if (!computer) {
      return value
    }

    return computer(value)
  }

  function defaults() {
    const defaults = {}

    for (const [key, setting] of Object.entries(settings)) {
      defaults[key] = setting.default
    }

    return defaults
  }

  function update(key, value) {
    if (!settings[key]) {
      return
    }

    const computedValue = compute(key, value)

    computed[key] = computedValue
    raw[key] = value

    if (settings[key].update) {
      settings[key].update(computedValue)
    }
  }

  return {
    computed,
    defaults,
    load: function () {
      const data = app.storage.get(storageKey)

      const values = {
        ...defaults(),
        ...data,
      }

      for (const [key, value] of Object.entries(values)) {
        update(key, value)
      }

      return this
    },
    raw,
    register: function (key, definition) {
      settings[key] = definition
      computed[key] = definition.default

      // Create helper
      const helperKey = `set${capitalize(key)}`

      const helper = function (value) {
        update(key, value)
        return this
      }

      this[helperKey] = helpers[helperKey] = helper

      return this
    },
    save: function () {
      app.storage.set(storageKey, raw)

      return this
    },
  }
})()
