import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

import { getCommand, parseCue, parseLine, parsePosition } from "./parser.ts";
import { BaseCommand, Cue } from "./parser.types.ts";

const exampleFile = `
REM GENRE Electronica
REM DATE 1998
REM COMMENT "ExactAudioCopy v1.3"
PERFORMER "Faithless"
TITLE "Live in Berlin"
FILE "Faithless - Live in Berlin.mp3" MP3
  TRACK 01 AUDIO
    TITLE "Reverence"
    PERFORMER "Faithless"
    REM COMPOSER "doriko"
    INDEX 01 00:00:00
  TRACK 02 AUDIO
    TITLE "She's My Baby"
    PERFORMER "Faithless"
    INDEX 01 06:42:00
  TRACK 03 AUDIO
    TITLE "Take the Long Way Home"
    PERFORMER "Faithless"
    INDEX 01 10:54:00
  TRACK 04 AUDIO
    TITLE "Insomnia"
    PERFORMER "Faithless"
    INDEX 01 17:04:00
  TRACK 05 AUDIO
    TITLE "Bring the Family Back"
    PERFORMER "Faithless"
    INDEX 01 25:44:00
  TRACK 06 AUDIO
    TITLE "Salva Mea"
    PERFORMER "Faithless"
    INDEX 01 30:50:00
  TRACK 07 AUDIO
    TITLE "Dirty Old Man"
    PERFORMER "Faithless"
    INDEX 01 38:24:00
  TRACK 08 AUDIO
    TITLE "God Is a DJ"
    PERFORMER "Faithless"
    INDEX 01 42:35
`.trim();

const exampleCommands: BaseCommand[] = [
  { name: "REM", args: ["GENRE", "Electronica"] },
  { name: "REM", args: ["DATE", "1998"] },
  { name: "REM", args: ["COMMENT", "ExactAudioCopy v1.3"] },
  { name: "PERFORMER", args: ["Faithless"] },
  { name: "TITLE", args: ["Live in Berlin"] },
  { name: "FILE", args: ["Faithless - Live in Berlin.mp3", "MP3"] },
  { name: "TRACK", args: ["01", "AUDIO"] },
  { name: "TITLE", args: ["Reverence"] },
  { name: "PERFORMER", args: ["Faithless"] },
  { name: "REM", args: ["COMPOSER", "doriko"] },
];

Deno.test("parseLine / parses lines correctly", () => {
  const lines = exampleFile.split("\n").slice(0, 10);

  assertEquals(lines.map(parseLine), exampleCommands);
});

Deno.test("parseLine / parses quoted strings correctly", () => {
  const lines = exampleFile.split("\n").slice(0, 10);

  assertEquals(parseLine(lines[5]), {
    name: "FILE",
    args: ["Faithless - Live in Berlin.mp3", "MP3"],
  });
});

Deno.test("getCommand / returns correct command", () => {
  assertEquals(exampleCommands.map(getCommand), [
    {
      name: "REM",
      key: "GENRE",
      value: "Electronica",
    },
    {
      name: "REM",
      key: "DATE",
      value: "1998",
    },
    {
      name: "REM",
      key: "COMMENT",
      value: "ExactAudioCopy v1.3",
    },
    {
      name: "PERFORMER",
      artist: "Faithless",
    },
    {
      name: "TITLE",
      title: "Live in Berlin",
    },
    {
      name: "FILE",
      fileName: [
        "Faithless",
        "-",
        "Live",
        "in",
        "Berlin.mp3",
      ].join(" "),
      type: "MP3",
    },
    {
      name: "TRACK",
      index: 1,
      type: "AUDIO",
    },
    {
      name: "TITLE",
      title: "Reverence",
    },
    {
      name: "PERFORMER",
      artist: "Faithless",
    },
    {
      name: "REM",
      key: "COMPOSER",
      value: "doriko",
    },
  ]);
});

Deno.test("getCommand / returns correct command", () => {
  assertEquals(parseCue(exampleFile), {
    title: "Live in Berlin",
    artist: "Faithless",
    genre: "Electronica",
    date: "1998",
    comment: "ExactAudioCopy v1.3",
    files: [
      {
        title: "Reverence",
        artist: "Faithless",
        composer: "doriko",
        source: "Faithless - Live in Berlin.mp3",
        start: "00:00",
      },
      {
        artist: "Faithless",
        source: "Faithless - Live in Berlin.mp3",
        start: "06:42",
        title: "She's My Baby",
      },
      {
        artist: "Faithless",
        source: "Faithless - Live in Berlin.mp3",
        start: "10:54",
        title: "Take the Long Way Home",
      },
      {
        artist: "Faithless",
        source: "Faithless - Live in Berlin.mp3",
        start: "17:04",
        title: "Insomnia",
      },
      {
        artist: "Faithless",
        source: "Faithless - Live in Berlin.mp3",
        start: "25:44",
        title: "Bring the Family Back",
      },
      {
        artist: "Faithless",
        source: "Faithless - Live in Berlin.mp3",
        start: "30:50",
        title: "Salva Mea",
      },
      {
        artist: "Faithless",
        source: "Faithless - Live in Berlin.mp3",
        start: "38:24",
        title: "Dirty Old Man",
      },
      {
        artist: "Faithless",
        source: "Faithless - Live in Berlin.mp3",
        start: "42:35",
        title: "God Is a DJ",
      },
    ],
  } as Cue);
});

Deno.test("parsePosition / parses position to timestamp", () => {
  const positions = [
    "00:00:00",
    "01:23:00",
    "12:34:01",
    "12:34:36",
    "12:34:74",
  ];

  assertEquals(positions.map(parsePosition), [
    "00:00",
    "01:23",
    "12:34.13",
    "12:34.48",
    "12:34.98",
  ]);
});
