const sass = require("sass");
const path = require("path");
const { SassString } = sass;

module.exports = {
  outputFileExtension: "css",

  compile: async function (inputContent, inputPath) {
    let parsed = path.parse(inputPath);
    let result = sass.compileString(inputContent, {
      loadPaths: [parsed.dir || ".", this.config.dir.includes],
      functions: {
        /*
						Goals:
						1. get the $name argument from the function
						2. search the src/assets/svgs
						3. match the first word in the svg file name to the $name in the sass function args
						4. return the path for the svg file 
						5. return as attribute (not as a string)
							return new SassString(`url(${args})`, {quotes: false});
						5. save the path as an argument in "fallback"
					*/
        "mdi-svg($name)": (args) => {
          return new SassString(`url(${args})`, {quotes: false});
        },
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
