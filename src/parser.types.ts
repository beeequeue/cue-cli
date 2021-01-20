type CueFile = {
  title?: string;
  artist?: string;
  composer?: string;
  isrc?: string;
  start: string;
};

export type Cue = {
  title?: string;
  artist?: string;
  genre?: string;
  discId?: string;
  catalog?: number;
  comment?: string;
  date?: Date;

  files: CueFile;
};

export type BaseCommand = {
  name: string;
  args: string[];
};

type FILE = BaseCommand & {
  name: "FILE";
  fileName: string;
  type: string;
};

type TRACK = BaseCommand & {
  name: "TRACK";
  index: number;
  type: string;
};

type INDEX = BaseCommand & {
  name: "INDEX";
  index: number;
  start: string;
};

type TITLE = BaseCommand & {
  name: "TITLE";
  title: string;
};

type PERFORMER = BaseCommand & {
  name: "PERFORMER";
  artist: string;
};

type SONGWRITER = BaseCommand & {
  name: "SONGWRITER";
  composer: string;
};

type CATALOG = BaseCommand & {
  name: "CATALOG";
  code: string;
};

type ISRC = BaseCommand & {
  name: "ISRC";
  isrc: string;
};

type REM = BaseCommand & {
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
