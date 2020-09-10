# syngen
A spatial sound and synthesis framework for accessible audio game development and experience design.

## Disclaimer
This repository is experimental and under active development.
Use at your own risk.

## Overview
This repository provides a basic template for getting started with any project.

Its JavaScript code is split into three namespaces:
- The `engine` namespace provides a light wrapper around the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) with tools to quickly build synths and position them as props on a two-dimensional stage.
Its event loop fires each frame to update props and core systems and can be subscribed to by userland code.
_Do not_ modify this code if you plan to receive updates in the future.
- The `content` namespace is a blank canvas intended for organizing userland code like props and additional systems.
For larger projects it's helpful to divide it into smaller sub-namespaces.
- The `app` namespace provides a skeleton and tools for managing a user interface and handling input.
Basic controls are provided for keyboard and gamepad users.
Use `app.utility.focus` to improve keyboard and screen reader accessibility.

The `public` directory holds all code that is distributed to the public, including the main index file which defines the interface and launches the experience.
Additional assets like fonts and images should live here.

The `build` process combines all source files and outputs them into the `public` directory.
This process _must_ be run before playing the first time or for any changes to be reflected.
Whenever new sources are created they should be added to `Gulpfile.js` in the correct order (i.e. without conflicts).

The `dist` process creates distributable archives within the `dist` directory containing the HTML5 build and an [Electron](https://electronjs.org) build targeting the current OS.
These files can then be shared on platforms like [itch.io](https://itch.io).

### Basic synthesis
This example shows how to define a prop with configurable options and instantiate one in the scene:

```js
// Invent the prop, inherits from engine.prop.base
content.prop.tone = engine.prop.base.invent({
  name: 'tone',
  // Called whenever instantiated (after engine.prop.base.construct())
  onConstruct: function ({
    color = 1,
    frequency = 440,
    gain = 1,
    type = 'sine',
  } = {}) {
    // Define a simple synth decorated with a lowpass filter and connect to prop output
    this.synth = engine.audio.synth.createSimple({
      frequency,
      gain,
      type,
    }).filtered({
      frequency: frequency * color,
    }).connect(this.output)
  },
  // Called whenever destroyed (after engine.prop.base.destroy())
  onDestroy: function () {
    // Be sure to stop running synths for garbage collection
    this.synth.stop()
  },
})

// Instantiate the prop with options
engine.props.create(content.prop.tone, {
  frequency: engine.utility.midiToFrequency(36),
  color: 4,
  gain: engine.utility.fromDb(-3),
  radius: 1,
  type: 'triangle',
  x: 10,
  y: 10,
})
```

More advanced applications will likely have managers that handle prop creation and destruction indirectly.
For example, [soundStrider](https://soundstrider.shiftbacktick.io) has a `content.system.generator` service that generates the game world in chunks and registers their props with `engine.streamer` so they're only instantiated when nearby.
The same strategy could be applied to a particle system or timed sequence.

### Roadmap
This repository is under active development.
Future updates should include:

- Adding JSDoc comments to high-level engine systems and utilities
- Creating an `engine.utility.perlin4d` utility to generate 4D Perlin noise
- Creating an `engine.utility.physical` decorator to grant physics to any object
- Creating an `engine.utility.vector2d` utility to model 2D vectors and complex numbers
- Creating an `engine.utility.vector3d` utility to model 3D vectors
- Reworking engine systems and utilities to work in three dimensions (but default to two)
- Reworking utilities that work with coordinates to accept object parameters
- Aligning example projects with engine changes

### Updating syngen
This repository assumes that all code in `src/css`, `src/js/app`, and `src/js/content` is your own.
The default files in those directories simply provide a starting point for new projects.

To ensure that updates can be applied in the future, please avoid making modifications to the `src/js/engine` directory.
To update to the latest engine, simply overwrite that directory with the contents from this repository.
Occasionally these updates may require copying changes to your `Gulpfile.js` for engine changes to be reflected.

### Example projects
- [Audo](https://github.com/nicross/audo) – Endless audio racing game
- [Kaleidophone](https://github.com/nicross/kaleidophone) – Relaxing generative audio toy
- [S.E.A.](https://github.com/nicross/sea) – Relaxing audio watercraft simulator

#### Commercial projects
- [soundStrider](https://soundstrider.shiftbacktick.io) – Psychedelic audio exploration game

## Development
To get started, please  use [npm](https://nodejs.org) to install the required dependencies:
```sh
npm install
```

### Common tasks
Common tasks have been automated with [Gulp](https://gulpjs.com):

#### Build once
```sh
gulp build
```

#### Build continuously
```sh
gulp watch
```

#### Create distributables
```sh
gulp dist
```

#### Open in Electron
```sh
gulp electron
```

#### Build and open in Electron
```sh
gulp electron-build
```

#### Command line flags
| Flag | Description |
| - | - |
| `--debug` | Suppresses minification. |
