export type Cue = {
  title?: string;
  artist?: string;
  genre?: string;
  discId?: string;
  catalog?: number;
  comment?: string;
  date?: string;
  files: CueFile[];
};

type CueFile = {
  title?: string;
  artist?: string;
  composer?: string;
  isrc?: string;

  source: string;
  start: string;
};

export type BaseCommand = {
  name: string;
  args: string[];
};

type FILE = {
  name: "FILE";
  fileName: string;
  type: string;
};

type TRACK = {
  name: "TRACK";
  index: number;
  type: string;
};

type INDEX = {
  name: "INDEX";
  index: number;
  start: string;
};

type TITLE = {
  name: "TITLE";
  title: string;
};

type PERFORMER = {
  name: "PERFORMER";
  artist: string;
};

type SONGWRITER = {
  name: "SONGWRITER";
  composer: string;
};

type CATALOG = {
  name: "CATALOG";
  code: string;
};

type ISRC = {
  name: "ISRC";
  isrc: string;
};

type REM = {
  name: "REM";
  key: string;
  value: string;
};

export type Command =
  | FILE
  | TRACK
  | INDEX
  | TITLE
  | PERFORMER
  | SONGWRITER
  | CATALOG
  | ISRC
  | REM;
