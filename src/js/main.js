'use strict'

document.addEventListener('DOMContentLoaded', () => {
  app.activate()
  engine.loop.start()

  engine.audio.mixer.master.output().gain.value = 1
})

// TODO: Call engine.audio.start() on first user gesture
