const path = require("path");
const fs = require("node:fs");
const svgToMiniDataURI = require("mini-svg-data-uri");
const { globSync } = require("glob");
const sass = require("sass");
const { SassString } = sass;

let svgs = {};

const searchDir = () => {
  const files = globSync(path.resolve(__dirname, "../assets/**/*.svg"));
  console.log("Found SVG files:", files);
  for (const file of files) {
    try {
      const data = fs.readFileSync(file, "utf8");
      const fileName = path.basename(file);
      svgs[fileName] = svgToMiniDataURI(data);
      console.log(`Processed: ${fileName}`);
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
    const icons = args.toString().replace(/['"]+/g, "");
    const image = svgs[`${icons}.svg`];
    return new SassString(`url("${image}")`, { quotes: false });
  },
};
