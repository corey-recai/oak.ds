import fs from "node:fs";

const components = fs
  .readdirSync("src", { withFileTypes: true })
  .map(item => item.name);

const deleteResource = (resource: string, recursive = false) => {
  console.log(`deleting ${resource}...`);
  fs.rmSync(resource, { force: true, recursive: recursive });
};

const createPackageJSON = (resource: string, content: string) => {
  console.log(`writing package.json to ${resource}...`);
  fs.writeFileSync(`${resource}/package.json`, content);
};

switch (process.argv[2]) {
  case "clean:build":
    components.forEach(dir => {
      if (dir === "index.ts") {
        [".d.ts", ".d.ts.map", ".js", ".js.map"].forEach(ext =>
          deleteResource(dir.replace(/\.[^/.]+$/, ext))
        );
      } else {
        deleteResource(dir, true);
      }
    });

    deleteResource("umd", true);

    deleteResource("dist", true);

    process.exit(0);
  case "post-build":
    components.forEach(dir => {
      if (dir !== "index.ts") {
        const packageJSON = JSON.stringify({
          sideEffects: false,
          module: "index.js",
          main: "index.js",
          types: "index.d.ts",
        });

        [`${dir}`, `umd/${dir}`].forEach(resource => {
          deleteResource(`${resource}/${dir}`, true);
          createPackageJSON(resource, packageJSON);
        });
      }
    });

    process.exit(0);
  default:
    console.error("Please specify a valid argument.");
    process.exit(9);
}
