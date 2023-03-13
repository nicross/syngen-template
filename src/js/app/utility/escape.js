app.utility.escape = (() => {
  const pubsub = engine.tool.pubsub.create()
  let state = false

  window.addEventListener('keydown', (e) => {
    if (e.code == 'Escape') {
      pubsub.emit('down')
      state = true
    }
  })

  window.addEventListener('keyup', (e) => {
    if (e.code == 'Escape') {
      pubsub.emit('up')
      state = false
    }
  })

  return pubsub.decorate({
    is: () => state,
  })
})()
