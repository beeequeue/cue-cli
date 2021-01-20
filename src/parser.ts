import {BaseCommand, Command, Cue} from "./parser.types.ts";

export const getCommand = (input: BaseCommand): Command => {
  switch (input.name as Command["name"]) {
    case "FILE":
      return {
        name: "FILE",
        args: input.args,
        fileName: input.args[0],
        type: input.args[1],
      };
    case "TRACK":
      return {
        name: "TRACK",
        args: input.args,
        index: Number(input.args[0]),
        type: input.args[1],
      };
    case "INDEX":
      return {
        name: "INDEX",
        args: input.args,
        index: Number(input.args[0]),
        start: input.args[1],
      };
    case "TITLE":
      return {
        name: "TITLE",
        args: input.args,
        title: input.args[0],
      };
    case "PERFORMER":
      return {
        name: "PERFORMER",
        args: input.args,
        artist: input.args[0],
      };
    case "SONGWRITER":
      return {
        name: "SONGWRITER",
        args: input.args,
        composer: input.args[0],
      };
    case "CATALOG":
      return {
        name: "CATALOG",
        args: input.args,
        code: input.args[0],
      };
    case "ISRC":
      return {
        name: "ISRC",
        args: input.args,
        isrc: input.args[0],
      };
    case "REM":
      return {
        name: "REM",
        args: input.args,
        key: input.args[0],
        value: input.args[1],
      };
  }
};

export const parseLine = (line: string): BaseCommand => {
  const split = line.trim().split(" ");

  let isInString = false;

  const command = {
    name: split[0],
    args: split.slice(1).reduce((accum, word) => {
      if (isInString) {
        accum[accum.length - 1] += ` ${word}`;

        if (word.match(/[^\\]"$/)) {
          isInString = false;
        }

        return [...accum]
      }

      if (word.match(/^"/)) {
        isInString = true;
      }

      return [...accum, word];
    }, [] as string[]),
  };

  command.args = command.args.map(arg => arg.replace(/^"(.*?)([^\\])"$/, "$1$2"))

  return command;
};

export const parseCue = (content: string): Cue => {
  return {} as any;
};
