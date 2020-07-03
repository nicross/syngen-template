'use strict'

// TODO: Separate synths into separate files
engine.audio.synth = {}

engine.audio.synth.assign = function (synth, key, plugin) {
  synth[key] = plugin
  synth.param = synth.param || {}
  synth.param[key] = plugin.param || {}
  return synth
}

engine.audio.synth.chain = function (synth, plugin) {
  const pluginInput = plugin.input || plugin,
    pluginOutput = plugin.output || plugin,
    synthChain = synth._chain,
    synthOutput = synth.output

  if (!synthChain || !synthChain.connect) {
    throw new Error('Synth has no chain')
  }

  if (!synthOutput || !synthOutput.connect) {
    throw new Error('Synth has no output')
  }

  if (!pluginInput || !pluginInput.connect) {
    throw new Error('Plugin has no input')
  }

  if (!pluginOutput || !pluginOutput.connect) {
    throw new Error('Plugin has no output')
  }

  synthChain.disconnect(synthOutput)
  synthChain.connect(pluginInput)
  pluginOutput.connect(synthOutput)
  synth._chain = pluginOutput

  this.chainStop(synth, plugin)

  return synth
}

engine.audio.synth.chainAssign = function (synth, key, plugin) {
  this.assign(synth, key, plugin)
  return this.chain(synth, plugin)
}

engine.audio.synth.chainStop = function (synth, plugin) {
  const pluginStop = plugin.stop,
    synthStop = synth.stop

  if (!pluginStop) {
    return synth
  }

  if (!synthStop) {
    throw new Error('Synth has no stop')
  }

  synth.stop = function (...args) {
    pluginStop(...args)
    synthStop(...args)
    return this
  }

  return synth
}

engine.audio.synth.createAdditive = ({
  harmonic: harmonicParams = [],
  when = engine.audio.time(),
} = {}) => {
  const context = engine.audio.context()

  const detuneConstant = context.createConstantSource(),
    frequencyConstant = context.createConstantSource(),
    output = context.createGain(),
    sum = context.createGain()

  detuneConstant.start(when)
  frequencyConstant.start(when)

  const gainDivisor = Math.max(harmonicParams.length - 1, 1)

  const harmonics = harmonicParams.map(({
    coefficient = 1,
    detune = 0,
    gain = 1,
    type = 'sine',
  }) => {
    const frequencyMultiplier = context.createGain(),
      mix = context.createGain(),
      oscillator = context.createOscillator()

    frequencyMultiplier.gain.value = coefficient
    oscillator.detune.value = detune
    oscillator.frequency.value = 0
    oscillator.type = type
    mix.gain.value = gain / gainDivisor

    detuneConstant.connect(oscillator.detune)
    frequencyConstant.connect(frequencyMultiplier)
    frequencyMultiplier.connect(oscillator.frequency)
    oscillator.connect(mix)
    mix.connect(sum)

    oscillator.start(when)

    return {
      oscillator,
      param: {
        coefficient: frequencyMultiplier.gain,
        detune: oscillator.detune,
        gain: mix.gain,
      },
    }
  })

  output.gain.value = engine.const.zeroGain
  sum.connect(output)

  return {
    _chain: sum,
    harmonic: harmonics,
    output,
    param: {
      detune: detuneConstant.offset,
      frequency: frequencyConstant.offset,
      gain: output.gain,
    },
    stop: function (when = engine.audio.time()) {
      if (harmonics.length) {
        harmonics[0].oscillator.onended = () => {
          output.disconnect()
        }
      }

      detuneConstant.stop(when)
      frequencyConstant.stop(when)
      harmonics.forEach((harmonic) => harmonic.oscillator.stop(when))

      return this
    }
  }
}

engine.audio.synth.createAm = ({
  carrierType = 'sine',
  modulatorType = 'sine',
  modulatorWhen,
  when = engine.audio.time(),
} = {}) => {
  const context = engine.audio.context()

  const carrierGain = context.createGain(),
    carrierOscillator = context.createOscillator(),
    modulatorDepth = context.createGain(),
    modulatorOscillator = context.createOscillator(),
    output = context.createGain()

  carrierGain.connect(output)

  carrierOscillator.connect(carrierGain)
  carrierOscillator.type = carrierType
  carrierOscillator.start(when)

  modulatorDepth.connect(carrierGain.gain)
  modulatorOscillator.connect(modulatorDepth)
  modulatorOscillator.type = modulatorType
  modulatorOscillator.start(modulatorWhen || when)

  output.gain.value = engine.const.zeroGain

  return {
    _chain: carrierGain,
    carrier: {
      gain: carrierGain,
      oscillator: carrierOscillator,
    },
    modulator: {
      depth: modulatorDepth,
      oscillator: modulatorOscillator,
    },
    output,
    param: {
      baseGain: carrierGain.gain,
      detune: carrierOscillator.detune,
      frequency: carrierOscillator.frequency,
      gain: output.gain,
      mod: {
        depth: modulatorDepth.gain,
        detune: modulatorOscillator.detune,
        frequency: modulatorOscillator.frequency,
      },
    },
    stop: function (when = engine.audio.time()) {
      carrierOscillator.onended = () => {
        output.disconnect()
      }

      carrierOscillator.stop(when)
      modulatorOscillator.stop(when)

      return this
    },
  }
}

engine.audio.synth.createAmBuffer = ({
  buffer,
  modulatorType = 'sine',
  modulatorWhen,
  rate = 1,
  when = engine.audio.time(),
} = {}) => {
  const context = engine.audio.context()

  const carrierGain = context.createGain(),
    carrierSource = context.createBufferSource(),
    modulatorDepth = context.createGain(),
    modulatorOscillator = context.createOscillator(),
    output = context.createGain()

  carrierGain.connect(output)

  carrierSource.buffer = buffer
  carrierSource.loop = true
  carrierSource.playbackRate.value = rate
  carrierSource.connect(carrierGain)
  carrierSource.start(when, engine.utility.random.float(0, buffer.length))

  modulatorDepth.connect(carrierGain.gain)
  modulatorOscillator.connect(modulatorDepth)
  modulatorOscillator.type = modulatorType
  modulatorOscillator.start(modulatorWhen || when)

  output.gain.value = engine.const.zeroGain

  return {
    _chain: carrierGain,
    carrier: {
      gain: carrierGain,
      source: carrierSource,
    },
    modulator: {
      depth: modulatorDepth,
      oscillator: modulatorOscillator,
    },
    output,
    param: {
      baseGain: carrierGain.gain,
      detune: carrierSource.detune,
      gain: output.gain,
      mod: {
        depth: modulatorDepth.gain,
        detune: modulatorOscillator.detune,
        frequency: modulatorOscillator.frequency,
      },
      rate: carrierSource.playbackRate,
    },
    stop: function (when = engine.audio.time()) {
      carrierSource.onended = () => {
        output.disconnect()
      }

      carrierSource.stop(when)
      modulatorOscillator.stop(when)

      return this
    },
  }
}

engine.audio.synth.createBuffer = ({
  buffer,
  rate = 1,
  when = engine.audio.time(),
} = {}) => {
  const context = engine.audio.context()

  const output = context.createGain(),
    source = context.createBufferSource()

  source.buffer = buffer
  source.loop = true
  source.playbackRate.value = rate
  source.connect(output)
  source.start(when, engine.utility.random.float(0, buffer.length))

  output.gain.value = engine.const.zeroGain

  return {
    _chain: source,
    output,
    param: {
      detune: source.detune,
      gain: output.gain,
      rate: source.playbackRate,
    },
    source,
    stop: function (when = engine.audio.time()) {
      source.onended = () => {
        output.disconnect()
      }

      source.stop(when)

      return this
    },
  }
}

engine.audio.synth.createFm = ({
  carrierType = 'sine',
  modulatorType = 'sine',
  modulatorWhen,
  when = engine.audio.time(),
} = {}) => {
  const context = engine.audio.context()

  const carrierOscillator = context.createOscillator(),
    modulatorDepth = context.createGain(),
    modulatorOscillator = context.createOscillator(),
    output = context.createGain()

  carrierOscillator.connect(output)
  carrierOscillator.type = carrierType
  carrierOscillator.start(when)

  modulatorDepth.connect(carrierOscillator.frequency)
  modulatorOscillator.connect(modulatorDepth)
  modulatorOscillator.type = modulatorType
  modulatorOscillator.start(modulatorWhen || when)

  output.gain.value = engine.const.zeroGain

  return {
    _chain: carrierOscillator,
    carrier: {
      oscillator: carrierOscillator,
    },
    modulator: {
      depth: modulatorDepth,
      oscillator: modulatorOscillator,
    },
    output,
    param: {
      detune: carrierOscillator.detune,
      frequency: carrierOscillator.frequency,
      gain: output.gain,
      mod: {
        depth: modulatorDepth.gain,
        detune: modulatorOscillator.detune,
        frequency: modulatorOscillator.frequency,
      },
    },
    stop: function (when = engine.audio.time()) {
      carrierOscillator.onended = () => {
        output.disconnect()
      }

      carrierOscillator.stop(when)
      modulatorOscillator.stop(when)

      return this
    },
  }
}

// XXX: Utility, incompatible with chaining
// TODO: Make compatible with chaining (_chain, output, stop)
engine.audio.synth.createGrain = ({
  buffer,
  detune = 0,
  duration,
  loop = false,
  loopEnd,
  loopStart,
  offset,
  playbackRate = 1,
  when = engine.audio.time(),
} = {}) => {
  const context = engine.audio.context(),
    source = context.createBufferSource()

  source.buffer = buffer
  source.detune = detune
  source.loop = loop
  source.playbackRate = playbackRate

  if (loop && loopEnd) {
    source.loopEnd = loopEnd
  }

  if (loop && loopStart) {
    source.loopStart = loopStart
  }

  source.start(when, offset, duration)

  return source
}

engine.audio.synth.createLfo = ({
  type = 'sine',
  when = engine.audio.time(),
} = {}) => {
  const context = engine.audio.context()

  const depth = context.createGain(),
    oscillator = context.createOscillator()

  oscillator.type = type
  oscillator.connect(depth)
  oscillator.start(when)

  return {
    _chain: oscillator,
    connect: function (...args) {
      depth.connect(...args)
      return this
    },
    disconnect: function (...args) {
      depth.connect(...args)
      return this
    },
    oscillator,
    param: {
      depth: depth.gain,
      detune: oscillator.detune,
      frequency: oscillator.frequency,
    },
    output: depth,
    stop: function (when = engine.audio.time()) {
      oscillator.onended = () => {
        depth.disconnect()
      }

      oscillator.stop(when)

      return this
    },
  }
}

engine.audio.synth.createMod = ({
  amodType = 'sine',
  amodWhen,
  carrierType = 'sine',
  fmodType = 'sine',
  fmodWhen,
  when = engine.audio.time(),
} = {}) => {
  const context = engine.audio.context()

  const amodDepth = context.createGain(),
    amodOscillator = context.createOscillator(),
    carrierGain = context.createGain(),
    carrierOscillator = context.createOscillator(),
    fmodDepth = context.createGain(),
    fmodOscillator = context.createOscillator(),
    output = context.createGain()

  carrierGain.connect(output)

  carrierOscillator.connect(carrierGain)
  carrierOscillator.type = carrierType
  carrierOscillator.start(when)

  amodDepth.connect(carrierGain.gain)
  amodOscillator.connect(amodDepth)
  amodOscillator.type = amodType
  amodOscillator.start(amodWhen || when)

  fmodDepth.connect(carrierOscillator.frequency)
  fmodOscillator.connect(fmodDepth)
  fmodOscillator.type = fmodType
  fmodOscillator.start(fmodWhen || when)

  output.gain.value = engine.const.zeroGain

  return {
    _chain: carrierGain,
    amod: {
      depth: amodDepth,
      oscillator: amodOscillator,
    },
    carrier: {
      gain: carrierGain,
      oscillator: carrierOscillator,
    },
    fmod: {
      depth: fmodDepth,
      oscillator: fmodOscillator,
    },
    output: output,
    param: {
      amod: {
        depth: amodDepth.gain,
        detune: amodOscillator.detune,
        frequency: amodOscillator.frequency,
      },
      baseGain: carrierGain.gain,
      fmod: {
        depth: fmodDepth.gain,
        detune: fmodOscillator.detune,
        frequency: fmodOscillator.frequency,
      },
      detune: carrierOscillator.detune,
      frequency: carrierOscillator.frequency,
      gain: output.gain,
    },
    stop: function (when = engine.audio.time()) {
      carrierOscillator.onended = () => {
        output.disconnect()
      }

      amodOscillator.stop(when)
      carrierOscillator.stop(when)
      fmodOscillator.stop(when)

      return this
    },
  }
}

engine.audio.synth.createPwm = ({
  type = 'sine',
  when = engine.audio.time(),
} = {}) => {
  // SEE: https://github.com/pendragon-andyh/WebAudio-PulseOscillator

  const context = engine.audio.context(),
    facade = context.createGain(),
    oscillator = context.createOscillator(),
    output = context.createGain(),
    shaperOne = context.createWaveShaper(),
    shaperPulse = context.createWaveShaper(),
    width = context.createGain()

  oscillator.type = type
  output.gain.value = engine.const.zeroGain
  shaperOne.curve = engine.audio.shape.one()
  shaperPulse.curve = engine.audio.shape.square()
  width.gain.value = 0

  facade.connect(output)
  oscillator.connect(shaperOne)
  oscillator.connect(shaperPulse)
  shaperOne.connect(width)
  shaperPulse.connect(facade)
  width.connect(shaperPulse)

  oscillator.start(when)

  return {
    _chain: facade,
    oscillator,
    output,
    param: {
      detune: oscillator.detune,
      frequency: oscillator.frequency,
      gain: output.gain,
      width: width.gain,
    },
    stop: function (when = engine.audio.time()) {
      oscillator.onended = () => {
        output.disconnect()
      }

      oscillator.stop(when)

      return this
    },
    width,
  }
}

engine.audio.synth.createSimple = ({
  type = 'sine',
  when = engine.audio.time(),
} = {}) => {
  const context = engine.audio.context()

  const oscillator = context.createOscillator(),
    output = context.createGain()

  oscillator.connect(output)
  oscillator.type = type
  oscillator.start(when)

  output.gain.value = engine.const.zeroGain

  return {
    _chain: oscillator,
    oscillator,
    output,
    param: {
      detune: oscillator.detune,
      frequency: oscillator.frequency,
      gain: output.gain,
    },
    stop: function (when = engine.audio.time()) {
      oscillator.onended = () => {
        output.disconnect()
      }

      oscillator.stop(when)

      return this
    },
  }
}

engine.audio.synth.filtered = function (synth) {
  const filter = engine.audio.context().createBiquadFilter()
  return this.chainAssign(synth, 'filter', filter)
}

engine.audio.synth.shaped = function (synth, curve) {
  const shaper = engine.audio.context().createWaveShaper()
  shaper.curve = curve
  return this.chainAssign(synth, 'shaper', shaper)
}
