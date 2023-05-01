import { readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

switch (process.argv[2]) {
  case "clean:build":
    console.log(`removing files in ${resolve("../@oak.ds-core")}...`);

    readdirSync(resolve(`../@oak.ds-core`), { withFileTypes: true }).forEach(
      item => {
        if (item.name !== "package.json")
          rmSync(resolve("../@oak.ds-core", item.name), {
            force: true,
            recursive: true,
          });
        console.log(`removed ${resolve("../@oak.ds-core", item.name)}...`);
      }
    );
    process.exit(0);
  default:
    console.error("Please specify a valid argument.");
    process.exit(9);
}
