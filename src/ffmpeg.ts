import { exists, Path } from "../deps.ts";
import { Cue } from "./parser.types.ts";
import { Options } from "./command.ts";
import { isNotFalsy } from "./utils.ts";

export const ffmpegSplitFile = async (
  cue: Cue,
  { output, source }: Options,
) => {
  if (!await exists(output)) {
    await Deno.mkdir(output, { recursive: true });
  }

  const promises = cue.files.map(async (file, index) => {
    const nextFile = cue.files[index + 1];

    const outputExtension = Path.extname(file.source);
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
      ["-c:a", "copy"],
      ["-ss", file.start],
      nextFile != null && ["-to", nextFile.start],
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
