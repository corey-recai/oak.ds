import { cwd } from "node:process";
import { resolve, dirname } from "node:path";
import {
  writeFileSync,
  readFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  rmSync,
} from "node:fs";

import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import ignoreImport from "rollup-plugin-ignore-import";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";

function findClosestPackageJson(start = cwd(), level = 0) {
  try {
    const path = resolve(start, "package.json");
    const content = readFileSync(path, { encoding: "utf8" });
    return JSON.parse(content);
  } catch {
    if (level >= 10) return {};
    return findClosestPackageJson(dirname(start), level + 1);
  }
}

function writeFileSyncRecursive(filename, content, charset = "utf8") {
  let filepath = filename.replace(/\\/g, "/");

  let root = "";
  if (filepath[0] === "/") {
    root = "/";
    filepath = filepath.slice(1);
  } else if (filepath[1] === ":") {
    root = filepath.slice(0, 3);
    filepath = filepath.slice(3);
  }

  const folders = filepath.split("/").slice(0, -1);
  folders.reduce((acc, folder) => {
    const folderPath = acc + folder + "/";
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }
    return folderPath;
  }, root);

  writeFileSync(root + filepath, content, charset);
}

function createPackageJSON(resource, content) {
  writeFileSyncRecursive(`${resource}/package.json`, content);
  console.log(`created ${resource}/package.json`);
}

function getInputFiles(format) {
  if (format !== "umd") return [...files, resolve(`src/index.ts`)];
  return resolve(`src/index.ts`);
}

const currentDir = cwd();

const pkg = findClosestPackageJson(currentDir);

const inputs = readdirSync("src", { withFileTypes: true })
  .filter(item => item.isDirectory())
  .map(item => item.name);

const files = inputs.map(item => resolve(`src/${item}/index.ts`));

const extensions = [".js", ".ts", ".jsx", ".tsx"];

const globals = { "solid-js/web": "solidJSWeb", "solid-js": "solidJS" };

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const babelTargets = pkg.browserslist || "last 2 years";

const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/,
};

const basePlugins = [
  ignoreImport({
    extensions: [".scss", ".css"],
  }),
  babel({
    extensions,
    exclude: /node_modules/,
    babelHelpers: "bundled",
    presets: [
      ["babel-preset-solid"],
      "@babel/preset-typescript",
      ["@babel/preset-env", { bugfixes: true, targets: babelTargets }],
    ],
  }),
  nodeResolve({ extensions }),
  commonjs(commonjsOptions),
  terser(),
];

const outputs = {
  esm: {
    name: "",
    dir: resolve(`../@oak.ds-core`),
    type: "module",
  },
  umd: {
    name: "oakDS",
    dir: resolve(`../@oak.ds-core/umd`),
    type: "module",
  },
  cjs: {
    name: "",
    dir: resolve(`../@oak.ds-core/node`),
    type: "commonjs",
  },
};

const options = Object.entries(outputs).map(
  ([format, { name, dir, type }]) => ({
    input: getInputFiles(format),
    external: ["solid-js", "solid-js/web", "solid-js/store", ...external],
    output: {
      dir,
      name,
      format,
      preserveModules: format !== "umd",
      preserveModulesRoot: resolve("src"),
      sourcemap: true,
      globals,
    },
    plugins: [
      ...basePlugins,
      typescript({ declarationDir: dir }),
      {
        name: "writePackageJSON",
        buildEnd() {
          const content = {
            sideEffects: false,
            module: "index.js",
            main: "index.js",
            types: "index.d.ts",
          };
          inputs.forEach(component => {
            if (format !== "umd")
              createPackageJSON(
                resolve(`${dir}/${component}`),
                JSON.stringify(content, null, 2)
              );
          });
          createPackageJSON(
            resolve(dir),
            JSON.stringify(
              {
                name: "@oak.ds/core",
                version: "0.0.0",
                type,
                ...content,
              },
              null,
              2
            )
          );
        },
      },
    ],
    cache: false,
  })
);

export default function () {
  console.log(`removing files in ${resolve("../@oak.ds-core")}...`);

  readdirSync(resolve(`../@oak.ds-core`), { withFileTypes: true }).forEach(
    item => {
      rmSync(resolve("../@oak.ds-core", item.name), {
        force: true,
        recursive: true,
      });
      console.log(`removed ${resolve("../@oak.ds-core", item.name)}...`);
    }
  );
  return options;
}
