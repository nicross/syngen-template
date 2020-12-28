# syngen-template
A template for creating accessible audio games and experiences with [syngen](https://github.com/nicross/syngen).

## Overview
This repository provides a basic template for getting started with any project.

Its JavaScript code is split into three namespaces:
- The `engine` namespace is an alias for [syngen](https://github.com/nicross/syngen).
Please reference its [API documentation](https://syngen.shiftbacktick.io/) to learn more.
_Do not_ modify this code if you plan to receive updates in the future.
- The `content` namespace is a blank canvas intended for organizing userland code like props and additional systems.
For larger projects it's helpful to divide it into smaller sub-namespaces.
- The `app` namespace provides a skeleton and tools for managing a user interface and handling input.
Basic controls are provided for keyboard and gamepad users.
Use `app.utility.focus` to improve keyboard and screen reader accessibility.

The `public` directory holds all code that is distributed to the public, including the main `index.html` file which defines the interface and launches the experience.
Additional assets like fonts and images should live here.

The `build` process combines all source files and outputs them into the `public` directory.
This process _must_ be run before playing the first time or for any changes to be reflected.
Whenever new sources are created they should be added to `Gulpfile.js` in the correct order (i.e. without conflicts).

The `dist` process creates distributable archives within the `dist` directory containing the HTML5 build and an [Electron](https://electronjs.org) build targeting the current OS.
These files can then be shared on platforms like [itch.io](https://itch.io).

### Updating syngen-template
This repository assumes that all code except for files within the `src/js/engine` directory is your own.
The default files here simply provide a starting point for new projects.
They are released into the public domain under The Unlicense.

To ensure that updates can be applied in the future, please avoid making modifications to the `src/js/engine` directory.
To update to the latest engine, simply overwrite that directory with the contents from this repository.
Occasionally these updates may require copying changes to your `Gulpfile.js` for engine changes to be reflected.

All other files may be optionally updated at your discretion.

### Example projects
- [Audo](https://github.com/nicross/audo) – Endless audio racing game
- [Auraboros](https://github.com/nicross/auraboros) – Endless audio bullet hell
- [Kaleidophone](https://github.com/nicross/kaleidophone) – Relaxing generative audio toy
- [S.E.A.](https://github.com/nicross/sea) – Relaxing audio watercraft simulator

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

### Start web server
```sh
gulp serve
```

#### Command line flags
| Flag | Description |
| - | - |
| `--debug` | Suppresses minification. |
