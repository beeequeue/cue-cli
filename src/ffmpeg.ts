import { exists, Path } from "../deps.ts";
import { Cue } from "./parser.types.ts";
import { Options } from "./command.ts";
import { isNotFalsy } from "./utils.ts";

const mp3Options = [
  ["-b:a", "320k"],
];

export const ffmpegSplitFile = async (
  cue: Cue,
  { output, source }: Options,
) => {
  if (!await exists(output)) {
    await Deno.mkdir(output, { recursive: true });
  }

  const promises = cue.files.map(async (file, index) => {
    const outputExtension = Path.extname(file.source) ?? ".mp3";
    const outputFilePath = Path.join(
      output,
      `${index + 1} - ${file.artist} - ${file.title}${outputExtension}`,
    );

    const cmd = [
      "ffmpeg",
      "-y",
      "-hide_banner",
      ["-loglevel", "warning"],
      ["-i", source ?? await Deno.realPath(file.source)],
      outputExtension === ".mp3" && mp3Options,
      outputFilePath,
    ].flat(2).filter(isNotFalsy);
    console.log("Running:\n" + cmd.join(" "));

    const process = Deno.run({
      cmd,
      stdout: "piped",
    });

    return process.status();
  });

  const results = await Promise.allSettled(promises);

  console.log(results);
};
