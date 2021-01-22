# cue-cli

A CLI for using `.cue` files.

## Installation

TODO

## Usage

**Requires `ffmpeg` to be available on the PATH.**

### Split file by `.cue` specification

```
$ cue-cli file.cue
```

## Options

```
Usage:   cue-cli <file:filepath>
Version: v0.0.0

Description:

  CLI for splitting audio files according to .cue files.

Options:

  -h, --help               - Show this help.

  -V, --version            - Show the version number for this program.

  -s, --source   <file>    - Override the file to split.

  -o, --output   <folder>  - Output directory.                          (Default: $CWD)
```
