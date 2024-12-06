// const fs = require('node:fs');
const path = require("path");
const sass = require("sass");
const { mdiSvg } = require("./mdiSvg");

module.exports = {
  outputFileExtension: "css",

  compile: async function (inputContent, inputPath) {
    let parsed = path.parse(inputPath);
    let result = sass.compileString(inputContent, {
      loadPaths: [parsed.dir || ".", this.config.dir.includes],
      functions: {
        "mdi-svg($fallback)": mdiSvg,
      },
    });

    let dependencies = result.loadedUrls
      .filter((dep) => dep.protocol === "file:")
      .map((entry) => {
        return path.relative(".", entry.pathname);
      });
    this.addDependencies(inputPath, dependencies);

    return async (data) => {
      return result.css;
    };
  },
};
