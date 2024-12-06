const { path, sass } = require("./utils");
const { mdiSvg } = require("./sassFunctions");

module.exports = {
  outputFileExtension: "css",

  compile: async function (inputContent, inputPath) {
    let parsed = path.parse(inputPath);
    let result = await sass.compileStringAsync(inputContent, {
      loadPaths: [parsed.dir || ".", this.config.dir.includes],
      functions: {
        "mdi-svg($name)": mdiSvg,
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
