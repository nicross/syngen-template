'use strict'

/**
 * NOTE: Unused
 *
 * This module isn't suitable for performance and memory reasons because it needs to iterate
 * (sampleRate * duration * frequencies) times for each target buffer.
 *
 * File it away for some other project, e.g. offline rendering via Python or Go.
 * Looked into caching via IndexedDB, simply not worth it.
 *
 * SEE: https://www.redblobgames.com/articles/noise/introduction.html
 */
engine.utility.noise = (() => {
  const frequencies = [...Array(20000).keys()].map((key) => key + 1)

  function generate(data, amplitude) {
    const length = data.length

    const amplitudes = frequencies.map(amplitude),
      noises = frequencies.map((frequency) => noise(frequency, length))

    let maxValue = 0

    for (let i = 0; i < length; i += 1) {
      data[i] = frequencies.reduce((sum, _, f) => {
        return sum + (amplitudes[f] * noises[f][i])
      }, 0)

      if (data[i] > maxValue || data[i] < -maxValue) {
        maxValue = Math.abs(data[i])
      }
    }

    if (maxValue <= 1) {
      return
    }

    const adjustment = 1 / maxValue

    for (let i = 0; i < length; i += 1) {
      data[i] *= adjustment
    }
  }

  function noise(frequency, length) {
    const output = [],
      phase = Math.random() * Math.PI * 2

    for (let i = 0; i < length; i += 1) {
      output[i] = Math.sin((2 * Math.PI * frequency * i / length) + phase)
    }

    return output
  }

  return {
    blue: (buffer) => generate(buffer, (f) => Math.sqrt(f)),
    pink: (buffer) => generate(buffer, (f) => 1 / Math.sqrt(f)),
    red: (buffer) => generate(buffer, (f) => 1 / f),
    violet: (buffer) => generate(buffer, (f) => f),
    white: (buffer) => generate(buffer, () => 1),
  }
})()
