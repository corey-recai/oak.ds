import withSolid from "rollup-preset-solid";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";

export default withSolid({
  input: "./src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
    preserveModules: true,
  },
  plugins: [
    typescript({ declaration: true, declarationDir: "dist" }),
    postcss({
      extract: true,
    }),
  ],
});
