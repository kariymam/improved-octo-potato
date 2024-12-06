const { DateTime } = require("luxon");
const SassHandler = require("./src/handler/sassHandler.js");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('./src/assets/svg');
    eleventyConfig.addPassthroughCopy('./src/assets/stylesheets/*.css');

    // Add SASS support
    eleventyConfig.addTemplateFormats("scss");
    eleventyConfig.addExtension("scss", SassHandler);

    return {
        dir: {
            input: "src",
            output: "_site"
        },
    };
};
//DEBUG=Eleventy* npx @11ty/eleventy