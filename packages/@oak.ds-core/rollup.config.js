import withSolid from "rollup-preset-solid";
import ignoreImport from "rollup-plugin-ignore-import";
import typescript from "@rollup/plugin-typescript";
import fs from "node:fs";

// const input = "src/index.ts";
const inputs = fs
  .readdirSync("src", { withFileTypes: true })
  .map(item => item.name);

const globals = { "solid-js/web": "solidJSWeb", "solid-js": "solidJS" };

const plugins = [
  ignoreImport({
    extensions: [".scss", ".css"],
  }),
];

const output = { sourcemap: true, globals };

const options = inputs.flatMap(item => {
  if (item === "index.ts") {
    return [
      {
        input: `src/${item}`,
        output: {
          ...output,
          dir: ".",
          format: "esm",
          preserveModules: true,
        },
        plugins: [...plugins, typescript({ declarationDir: "." })],
        // writePackageJson: true,
        // printInstructions: true,
      },
      {
        input: `src/${item}`,
        output: {
          ...output,
          dir: "umd",
          name: "oakDS",
          format: "umd",
          preserveModules: false,
        },
        plugins: [...plugins, typescript({ declarationDir: "umd" })],
        // writePackageJson: true,
        // printInstructions: true,
      },
    ];
  } else {
    return [
      {
        input: `src/${item}/index.ts`,
        output: {
          ...output,
          dir: item,
          format: "esm",
          preserveModules: true,
        },
        plugins: [...plugins, typescript({ declarationDir: item })],
        // writePackageJson: true,
        // printInstructions: true,
      },
      {
        input: `src/${item}/index.ts`,
        output: {
          ...output,
          dir: `umd/${item}`,
          name: `oak${item}`,
          format: "umd",
          preserveModules: false,
        },
        plugins: [...plugins, typescript({ declarationDir: `umd/${item}` })],
        // writePackageJson: true,
        // printInstructions: true,
      },
    ];
  }
});
// console.log(options);
export default withSolid(options);

// export default withSolid([
//   {
//     input: "src/index.ts",
//     output: {
//       ...output,
//       dir: ".",
//       format: "esm",
//       preserveModules: true,
//     },
//     plugins: [...plugins, typescript({ declarationDir: "." })],
//     writePackageJson: true,
//     printInstructions: true,
//   },
//   {
//     input: "src/index.ts",
//     output: {
//       ...output,
//       dir: "umd",
//       name: "oakDS",
//       format: "umd",
//       preserveModules: false,
//     },
//     plugins: [...plugins, typescript({ declarationDir: "umd" })],
//     writePackageJson: true,
//     printInstructions: true,
//   },
// ]);
