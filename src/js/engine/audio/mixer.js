'use strict'

engine.audio.mixer = (() => {
  const context = engine.audio.context()

  const masterCompensator = context.createGain(),
    masterCompressor = context.createDynamicsCompressor(),
    masterInput = context.createGain(),
    masterOutput = context.createGain()

  let masterHighpass,
    masterLowpass

  masterCompensator.gain.value = engine.const.masterCompensatorGain
  masterCompressor.ratio.value = engine.const.masterCompressorRatio
  masterCompressor.threshold.value = engine.const.masterCompressorThreshold

  masterCompressor.connect(masterCompensator)
  masterCompensator.connect(masterOutput)
  masterOutput.connect(context.destination)

  createFilters()

  masterOutput.gain.value = engine.const.zeroGain

  function createFilters() {
    masterHighpass = context.createBiquadFilter()
    masterHighpass.type = 'highpass'
    masterHighpass.frequency.value = engine.const.minFrequency

    masterLowpass = context.createBiquadFilter()
    masterLowpass.type = 'lowpass'
    masterLowpass.frequency.value = engine.const.maxFrequency

    masterInput.connect(masterHighpass)
    masterHighpass.connect(masterLowpass)
    masterLowpass.connect(masterCompressor)
  }

  function destroyFilters() {
    masterInput.disconnect()
    masterLowpass.disconnect()
    masterLowpass = null
    masterHighpass.disconnect()
    masterHighpass = null
  }

  return {
    auxiliary: {},
    bus: {},
    createAuxiliary: () => {
      const input = context.createGain(),
        output = context.createGain()

      output.connect(masterInput)

      return {
        input,
        output,
      }
    },
    createBus: () => {
      const input = context.createGain()
      input.connect(masterInput)
      return input
    },
    master: {
      input: () => masterInput,
      output: () => masterOutput,
    },
    rebuildFilters: function () {
      destroyFilters()
      createFilters()
      return this
    },
  }
})()
