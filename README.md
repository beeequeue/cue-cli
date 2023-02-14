# cue-cli

A CLI for using `.cue` files.

## Installation

### Deno

`deno install -f -n cue --allow-read --allow-write --allow-run=ffmpeg https://raw.githubusercontent.com/BeeeQueue/cue-cli/main/mod.ts`

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

  -o, --output   <folder>  - Output directory.                          (Default: $CWD/out)
```
