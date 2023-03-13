app.screen.base = {
  // Attributes
  id: undefined,
  parentSelector: undefined,
  rootSelector: undefined,
  transitions: {},
  // State
  state: {},
  // Hooks
  onReady: function () {},
  onEnter: function () {},
  onExit: function () {},
  onFrame: function () {},
  onImport: function () {},
  onReset: function () {},
  // Lifecycle methods
  enter: function (...args) {
    this.parentElement.removeAttribute('aria-hidden')
    this.parentElement.removeAttribute('hidden')

    window.requestAnimationFrame(() => {
      this.parentElement.onanimationend = undefined
      this.parentElement.classList.add('a-app--screen-active')
      this.parentElement.classList.remove('a-app--screen-inactive')
    })

    this.onEnter(...args)
    this.focusWithin()

    return this
  },
  exit: function (...args) {
    this.parentElement.setAttribute('aria-hidden', 'true')

    window.requestAnimationFrame(() => {
      this.parentElement.classList.remove('a-app--screen-active')
      this.parentElement.classList.add('a-app--screen-inactive')

      this.parentElement.onanimationend = () => {
        this.parentElement.classList.remove('a-app--screen-inactive')
        this.parentElement.hidden = true
      }
    })

    this.onExit(...args)

    return this
  },
  import: function (...args) {
    this.onImport(...args)

    return this
  },
  ready: function (...args) {
    this.parentElement = document.querySelector(this.parentSelector)
    this.parentElement.setAttribute('aria-hidden', 'true')
    this.parentElement.hidden = true

    this.rootElement = document.querySelector(this.rootSelector)
    app.utility.focus.trap(this.rootElement)

    this.onReady(...args)

    return this
  },
  reset: function () {
    this.onReset()

    return this
  },
  // Custom methods
  focusWithin: function () {
    if (this.rootElement.getAttribute('tabindex') == -1) {
      app.utility.focus.set(this.rootElement)
    } else {
      app.utility.focus.setWithin(this.rootElement)
    }

    return this
  },
}
