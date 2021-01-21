import { Command } from "../deps.ts";
import { parseCue } from "./parser.ts";

export const runCommand = async () => {
  const { args, options } = await new Command<{ source?: string }>()
    .name("cue-cli")
    .description("CLI for splitting audio files according to .cue files.")
    .type("filepath", (input) => Deno.realPathSync(input.value))
    .arguments("<file:filepath>")
    .option("-s, --source <file:filepath>", "Override the file to split.")
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
};
