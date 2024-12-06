const path = require("path");
const { globSync } = require("glob");
const sass = require("sass");
const { SassString } = sass;

let svgs = {};

const searchDir = () => {
  const files = globSync(path.resolve(__dirname, "../assets/**/*.svg"));
  // console.log("Found SVG files:", files);
  for (const file of files) {
    try {
      const fileName = path.basename(file);
      svgs[fileName] = `url(/assets/svg/${fileName})`;
      // console.log(`Processed: ${fileName}`);
    } catch (err) {
      console.error(err);
    }
  }
};

// Populate `svgs`
searchDir();

module.exports = {
  get svgs() {
    // Getter ensures the latest version of `svgs`
    return svgs;
  },
  mdiSvg: (args) => {
    // Clean up scss arg
    const icons = args.toString().replace(/['"]+/g, "");

    // Fuzzy matching logic
    const matchingKey = Object.keys(svgs).find((key) =>
      key.toLowerCase().startsWith(icons.toLowerCase())
    );

    // Return the matched SVG or null if no match is found
    const image = matchingKey ? svgs[matchingKey] : null;

    return new SassString(image, { quotes: false });
  },
};
