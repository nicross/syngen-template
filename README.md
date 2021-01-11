# syngen-template
A template for creating accessible audio games and experiences with [syngen](https://github.com/nicross/syngen).

## Overview
This repository provides a basic template for getting started with any project.
Its default files can be modified or removed as needed.
They are released into the public domain under The Unlicense.

### Code structure
Code in the `src/js` directory is split into three namespaces:
- The `app` namespace provides the scaffolding for a basic user interface:
  - `app.controls` provides basic keyboard and gamepad control mapping.
  - `app.overlaySupport` provides a hack for Steam Overlay support.
  - `app.utility` provides tools for solving common problems:
    - `app.utility.dom` provides methods related to DOM traversal.
    - `app.utility.focus` provides methods for manipulating focus state.
    - `app.utility.input` provides methods related to HTML form inputs.
- The `engine` namespace is an alias for [syngen](https://github.com/nicross/syngen).
Please reference its [API documentation](https://syngen.shiftbacktick.io/) to learn more.
- The `content` namespace is provided as an umbrella for additional modules like props and systems.

Essentially `app` controls `engine` with `content` plugins.

### Directory structure
The `public` directory holds all files that are distributed to the public, such as fonts and images.
Importantly its `index.html` is the main entrypoint for the web application.

The `electron` directory contains code specific to the desktop application.
It exposes an `ElectronApi` global to the web application via `preload.js`.

The `assets` directory contains art assets and their working directories, such as the application icon.
From here a build process could perform additional processing and output the result into the `public` directory.

### Task automation
Common development tasks are defined in `Gulpfile.js`.

The `build` task compresses all CSS and JS sources and outputs them into the `public` directory.
Beware that the default source order may need adjusted.
This process _must_ be run whenever changes are made, but can be automated with the `watch` task.

The `dist` task creates distributable archives within the `dist` directory containing the HTML5 build and an [Electron](https://electronjs.org) build targeting the current OS.
These files can then be shared on platforms like [itch.io](https://itch.io).

## Getting started
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

### Start web server and build continuously
```sh
gulp dev
```

#### Command line flags
| Flag | Description |
| - | - |
| `--debug` | Suppresses minification. |
