import { build, emptyDir } from "https://deno.land/x/dnt@0.39.0/mod.ts";

const name = "unknownutil";
const version = Deno.args[0];
if (!version) {
  throw new Error("No version argument is specified");
}
console.log("*".repeat(80));
console.log(`${name} ${version}`);
console.log("*".repeat(80));

await emptyDir("./npm");

await build({
  typeCheck: false,
  // XXX:
  // snapshot tests doesn't work with dnt so we disable tests for now
  // https://github.com/denoland/dnt/issues/254
  test: false,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: "dev",
  },
  package: {
    // package.json properties
    name,
    version,
    author: "Alisue <lambdalisue@gmail.com>",
    license: "MIT",
    repository: "https://github.com/lambdalisue/deno-unknownutil",
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");

// build README for npm
let readme = Deno.readTextFileSync("README.md");
readme = readme.replaceAll(
  "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts",
  name,
);
readme = readme.replaceAll(
  "## Usage",
  `## Install\n\nInstall via npm:\n\n\`\`\`sh\nnpm install --save ${name}\n\`\`\`\n\n## Usage`,
);
Deno.writeTextFileSync("npm/README.md", readme);
