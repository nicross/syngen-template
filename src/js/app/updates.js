app.updates = (() => {
  const registry = []

  function apply() {
    const appVersion = app.version().replace('-debug', ''),
      storageVersions = app.storage.getVersions()

    // First time player
    if (!storageVersions.length) {
      return app.storage.setVersion(appVersion)
    }

    // No update required
    if (storageVersions.includes(appVersion)) {
      return app.storage.setVersion(appVersion)
    }

    // Determine closest earlier version
    const storageVersion = storageVersions.reduce((best, version) => {
      return app.utility.semver.isLater(version, best) && app.utility.semver.isEarlier(version, appVersion)
        ? version
        : best
    })

    // Upgrade storage
    app.storage.cloneVersion(storageVersion, appVersion)
      .setVersion(appVersion)

    // Apply updates
    registry.sort((a, b) => app.utility.semver.compare(a.semver, b.semver))

    for (const update of registry) {
      if (app.utility.semver.isLater(update.semver, storageVersion)) {
        update.fn()
      }
    }
  }

  return {
    apply,
    register: function (semver, fn) {
      registry.push({
        fn,
        semver: app.utility.semver.parse(semver),
      })

      return this
    },
    rescaleSetting: function (value, min, max, step) {
      value = engine.fn.lerp(min, max, value)
      value = Math.round(value / step) * step
      value = engine.fn.scale(value, min, max, 0, 1)

      return value
    }
  }
})()
