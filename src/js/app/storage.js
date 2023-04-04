app.storage = (() => {
  let version

  function get(key) {
    const data = app.storage.api.get(version) || {}
    return data[key]
  }

  function set(key, value) {
    app.storage.api.set(version, key, value)
  }

  return {
    cloneVersion: function (from, to) {
      const data = app.storage.api.get(from)

      for (const key of Object.keys(data)) {
        this.api.set(to, key, data[key])
      }

      return this
    },
    deleteVersion: function (version) {
      const data = app.storage.api.get(version)

      for (const key of Object.keys(data)) {
        this.api.delete(version, key)
      }

      return this
    },
    clear: function (key) {
      set(key, null)

      return this
    },
    get: (key) => get(key) || {},
    getVersion: function () {
      return version
    },
    getVersions: function () {
      return this.api.versions().sort((a, b) => {
        return app.utility.semver.compare(a, b)
      })
    },
    has: (key) => Boolean(get(key)),
    ready: function () {
      return this.api.ready()
    },
    set: function (key, value) {
      set(key, value)

      return this
    },
    setVersion: function (value) {
      version = value.replace('-debug', '')
      return this
    },
  }
})()
