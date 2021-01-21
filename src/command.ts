import { Command, Path } from "../deps.ts";
import { parseCue } from "./parser.ts";
import { ffmpegSplitFile } from "./ffmpeg.ts";

export type Options = {
  output: string;
  source?: string;
};

export const runCommand = async () => {
  const { args, options } = await new Command<Options>()
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
    )
    .parse(Deno.args);

  const decoder = new TextDecoder("utf-8");
  const buffer = await Deno.readFile(args[0]);
  const contents = decoder.decode(buffer).trim();

  const cue = parseCue(contents);

  let lastSource = "";
  try {
    cue.files.forEach(({ source }) => {
      lastSource = source;
      Deno.realPathSync(source);
    });
  } catch {
    throw new Error(`Could not find the source file (${lastSource})`);
  }

  await ffmpegSplitFile(cue, options);
};
