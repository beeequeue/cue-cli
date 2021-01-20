import { Command } from "./deps.ts";

const { args, options } = await new Command<{ source?: string }>()
  .name("cue-cli")
  .description("CLI for splitting audio files according to .cue files.")
  .type("filepath", (input) => Deno.realPathSync(input.value))
  .arguments("<file:filepath>")
  .option("-s, --source <file:filepath>", "Override the file to split.")
  .parse(Deno.args);

console.log({ args, options });

