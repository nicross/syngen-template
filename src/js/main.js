engine.ready(() => {
  app.activate()
  engine.loop.start()
})

// TODO: Call engine.audio.start() on first user gesture
