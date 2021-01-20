import type { DenonConfig } from "./deps.ts";

const config: DenonConfig = {
  allow: {
    read: true,
  },
  unstable: true,
  inspect: "9229",

  scripts: {
    dev: {
      cmd: "deno run mod.ts",
    },
  },
};

export default config;
