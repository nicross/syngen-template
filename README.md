# syngen-template
A template for creating accessible audio experiences with [syngen](https://github.com/nicross/syngen).

## Overview
This repository provides a basic template for getting started with any project.
Its default files can be modified or removed as needed.
They are released into the public domain under The Unlicense.

### Code structure
Code in the `src/js` directory is split into three namespaces:
- The `app` namespace provides the scaffolding for a basic user interface. _To be documented._
- The `engine` namespace is an alias for [syngen](https://github.com/nicross/syngen).
Please reference its [API documentation](https://syngen.shiftbacktick.io/) to learn more.
- The `content` namespace is provided as an umbrella for everything else.

Essentially `app` controls `engine` with `content` plugins.

## Getting started
To get started, please use [npm](https://nodejs.org) to install the required dependencies:
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
