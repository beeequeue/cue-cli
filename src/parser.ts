import { BaseCommand, Command, Cue } from "./parser.types.ts";

export const getCommand = (input: BaseCommand): Command => {
  switch (input.name as Command["name"]) {
    case "FILE":
      return {
        name: "FILE",
        fileName: input.args[0],
        type: input.args[1],
      };
    case "TRACK":
      return {
        name: "TRACK",
        index: Number(input.args[0]),
        type: input.args[1],
      };
    case "INDEX":
      return {
        name: "INDEX",
        index: Number(input.args[0]),
        start: input.args[1],
      };
    case "TITLE":
      return {
        name: "TITLE",
        title: input.args[0],
      };
    case "PERFORMER":
      return {
        name: "PERFORMER",
        artist: input.args[0],
      };
    case "SONGWRITER":
      return {
        name: "SONGWRITER",
        composer: input.args[0],
      };
    case "CATALOG":
      return {
        name: "CATALOG",
        code: input.args[0],
      };
    case "ISRC":
      return {
        name: "ISRC",
        isrc: input.args[0],
      };
    case "REM":
      return {
        name: "REM",
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

        return [...accum];
      }

      if (word.match(/^"/)) {
        isInString = true;
      }

      return [...accum, word];
    }, [] as string[]),
  };

  command.args = command.args.map((arg) =>
    arg.replace(/^"(.*?)([^\\])"$/, "$1$2")
  );

  return command;
};

export const parseCue = (content: string): Cue => {
  const commands = content.split("\n").map(parseLine).map(getCommand);

  let cue: Cue = {
    files: [],
  };

  let currentFile: number | null = null;
  let currentSource: string | null = null;

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];

    const setOnCorrectTarget = ({ name, ...data }: Command) => {
      if (currentFile != null) {
        cue.files[currentFile] = {
          ...cue.files[currentFile],
          ...data,
        };

        return;
      }

      cue = {
        ...cue,
        ...data,
      };
    };

    switch (command.name) {
      case "FILE":
        currentSource = command.fileName;
        break;

      case "TRACK":
        currentFile = cue.files.length;

        cue.files[currentFile] ??= {} as any;
        cue.files[currentFile].source = currentSource!;
        break;

      case "INDEX":
        cue.files[currentFile!].start = command.start;
        break;

      case "TITLE":
      case "PERFORMER":
      case "SONGWRITER":
      case "CATALOG":
      case "ISRC":
        setOnCorrectTarget(command);
        break;

      case "REM":
        setOnCorrectTarget({
          name: "REM" as any,
          [command.key.toLowerCase()]: command.value,
        } as unknown as Command);
        break;
    }
  }

  return cue;
};
