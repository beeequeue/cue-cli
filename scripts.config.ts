import type { DenonConfig } from "./deps.ts";

const config: DenonConfig = {
  unstable: true,

  scripts: {
    start: {
      cmd: "deno run mod.ts",
    },
  },
};

export default config;