const app = (() => {
  const readyContext = {}

  const ready = new Promise((resolve, reject) => {
    readyContext.resolve = resolve
    readyContext.reject = reject
  })

  let isActive = false,
    root

  return {
    activate: function () {
      isActive = true

      root = document.querySelector('.a-app')
      root.classList.add('a-app-active')

      readyContext.resolve()

      return this
    },
    isActive: () => isActive,
    isElectron: () => typeof ElectronApi != 'undefined',
    name: () => 'syngen-template',
    quit: function () {
      if (this.isElectron()) {
        ElectronApi.quit()
      }

      return this
    },
    ready: async (callback) => {
      return typeof callback == 'function'
        ? readyContext.then(callback)
        : readyContext
    },
    screen: {},
    utility: {},
    version: () => '0.0.0', // Replaced via Gulpfile.js
  }
})()
