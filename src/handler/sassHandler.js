const sass = require("sass");
const path = require("path");
const { SassString } = sass;

module.exports = {
		outputFileExtension: "css",

		compile: async function (inputContent, inputPath) {
			let parsed = path.parse(inputPath);
			let result = sass.compileString(inputContent, {
				loadPaths: [
					parsed.dir || ".",
					this.config.dir.includes
				],
				functions: {
					"mdi-svg($name, $fallback)": (args) => {
						const nameValue = args.getValue();
						const [named, ...fallback] = nameValue.split(/\s+/);
						return new SassString(`url(${named}${fallback})`);
					},
				},
			});

			let dependencies = result.loadedUrls.filter(dep => dep.protocol === "file:").map(entry => {
				return path.relative(".", entry.pathname);
			});
			this.addDependencies(inputPath, dependencies);

			return async (data) => {
				return result.css
			};
		},
};