import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import * as Path from "https://deno.land/std@0.177.0/path/mod.ts";

import { parseCue } from "./parser.ts";
import { ffmpegSplitFile } from "./ffmpeg.ts";

const command = new Command()
  .name("cue-cli")
  .version("0.0.0")
  .description("CLI for splitting audio files according to .cue files.")
  .type("filepath", ({ value }) => Deno.realPathSync(value))
  .type(
    "path",
    ({ value }) =>
      Path.isAbsolute(value) ? value : Path.join(Deno.cwd(), value),
  )
  .arguments("<file:filepath>")
  .option("-s, --source <file:filepath>", "Override the file to split.")
  .option(
    "-o, --output <folder:path>",
    "Output directory.",
    { default: Path.join(Deno.cwd(), "out") },
  );

export type Options = Awaited<ReturnType<typeof command["parse"]>>["options"];

export const runCommand = async () => {
  const { args, options } = await command.parse(Deno.args);

  const decoder = new TextDecoder("utf-8");
  const buffer = await Deno.readFile(args[0]);
  const contents = decoder.decode(buffer).trim();

  const cue = parseCue(contents);

  if (options.source == null) {
    let lastSource = "";

    try {
      cue.files.forEach(({ source }) => {
        lastSource = source;
        Deno.realPathSync(source);
      });
    } catch {
      throw new Error(`Could not find the source file (${lastSource})`);
    }
  }

  await ffmpegSplitFile(cue, options);
};
