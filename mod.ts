import { Command } from "./deps.ts";

type Options = {
  source?: string;
};

const { options } = await new Command()
  .name("cue-cli")
  .description("CLI for splitting audio files according to .cue files.")
  .arguments("<file>")
  .option("-s, --source <file>", "Override the file to split.")
  .parse(Deno.args);

console.log(options);