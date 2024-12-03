const sass = require("sass");
const path = require("path");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('./src/assets/svg');
    eleventyConfig.addPassthroughCopy('./src/assets/stylesheets/*.css');
    // eleventyConfig.addWatchTarget("./src/sass");

    // Add SASS support
    eleventyConfig.addTemplateFormats("scss");

    eleventyConfig.addExtension("scss", {
		outputFileExtension: "css",

		compile: function (inputContent, inputPath) {
			let parsed = path.parse(inputPath);
			let result = sass.compileString(inputContent, {
				loadPaths: [
					parsed.dir || ".",
					this.config.dir.includes
				]
			});

			let dependencies = result.loadedUrls.filter(dep => dep.protocol === "file:").map(entry => {
				return path.relative(".", entry.pathname);
			});
			this.addDependencies(inputPath, dependencies);

			return (data) => {
				return result.css
			};
		}
	});


    return {
        dir: {
            input: "src",
            output: "_site"
        },
    };
};
//DEBUG=Eleventy* npx @11ty/eleventy