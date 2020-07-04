'use strict'

engine.const = {
  acousticShadowFrequency: 343 / 0.1524, // speedOfSound / binauralHeadWidth
  audioLatencyHint: 1/60, // SEE: AudioContextOptions.latencyHint
  audioLookaheadTime: 1/120, // TODO: Implement support for larger values
  binauralHeadWidth: 0.1524, // m
  binauralShadowOffset: Math.PI / 4, // radian offset of each ear from +/- 90 deg
  binauralShadowRolloff: 1, // m
  distancePower: 2, // 1 / (d ** distancePower)
  distancePowerHorizon: false, // Whether to dropoff power calculations as a ratio of streamerRadius
  distancePowerHorizonExponent: 0, // Speed of the distance dropoff
  gravity: 9.8, // m/s
  idleDelta: 1/60, // s
  masterCompensatorGain: engine.utility.fromDb(3), // dB, applied after compressor
  masterCompressorRatio: 16, // SEE: DynamicsCompressorNode.ratio
  masterCompressorThreshold: -32, // SEE: DynamicsCompressorNode.threshold
  maxFrequency: 20000, // Hz
  maxSafeFloat: (2 ** 43) - 1, // Math.MAX_SAFE_INTEGER / (2 ** 10), or about 3 decimal places of precision
  midiReferenceFrequency: 440, // Hz
  midiReferenceNote: 69, // A4
  minFrequency: 20, // Hz
  movementMaxRotation: Math.PI / 2, // radian/s
  movementMaxVelocity: 2, // m/s
  positionRadius: 0.25, // m
  propFadeDuration: 1, // s
  reverbActive: true, // Disable for performance
  reverbImpulse: 'large', // engine.audio.buffer.impulse[reverbImpulse]
  seed: 'syngen', // prepended to all engine.utility.srand() instances
  seedSeparator: '~', // separator for arrays used as engine.utility.srand() seeds
  speedOfSound: 343, // m/s
  streamerRadius: 343, // m
  subFrequency: 60, // Hz
  zero: 10 ** -32, // Close enough to zero
  zeroDb: -96, // dB, close enough to silence
  zeroGain: engine.utility.fromDb(-96), // engine.utility.fromDb(zeroDb)
  zeroTime: 5 * (10 ** -3), // s, close enough to instantaneous
}
