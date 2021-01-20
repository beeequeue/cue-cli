import { assertEquals } from "../devDeps.ts";
import { getCommand, parseLine } from "./parser.ts";
import { BaseCommand } from "./parser.types.ts";

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
    INDEX 01 42:35:00
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
      args: [
        "GENRE",
        "Electronica",
      ],
      name: "REM",
      key: "GENRE",
      value: "Electronica",
    },
    {
      args: [
        "DATE",
        "1998",
      ],
      name: "REM",
      key: "DATE",
      value: "1998",
    },
    {
      args: [
        "COMMENT",
        "ExactAudioCopy v1.3",
      ],
      name: "REM",
      key: "COMMENT",
      value: "ExactAudioCopy v1.3",
    },
    {
      args: [
        "Faithless",
      ],
      name: "PERFORMER",
      artist: "Faithless",
    },
    {
      args: [
        "Live in Berlin",
      ],
      name: "TITLE",
      title: "Live in Berlin",
    },
    {
      args: [
        "Faithless - Live in Berlin.mp3",
        "MP3",
      ],
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
      args: [
        "01",
        "AUDIO",
      ],
      name: "TRACK",
      index: 1,
      type: "AUDIO",
    },
    {
      args: [
        "Reverence",
      ],
      name: "TITLE",
      title: "Reverence",
    },
    {
      args: [
        "Faithless",
      ],
      name: "PERFORMER",
      artist: "Faithless",
    },
    {
      args: [
        "COMPOSER",
        "doriko",
      ],
      name: "REM",
      key: "COMPOSER",
      value: "doriko",
    },
  ]);
});
