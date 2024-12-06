const fs = require("node:fs");
const sharp = require("sharp");
const { globSync } = require("glob");
const { path, sass } = require("./utils");
const { SassString, SassMap } = sass;

let svgs = {};
const assetsDir = "/assets/svg";

const getSVGObjData = async () => {
  const files = globSync(path.resolve(__dirname, "../**/*.svg"));
  console.log("Found SVG files:", files);

  const svgPromises = files.map(async (file) => {
    try {
      const fileName = path.basename(file);
      const filepath = path.format({
        root: __dirname,
        dir: `${assetsDir}`,
        base: `${fileName}`,
      });
      const data = fs.readFileSync(file, "utf8");

      // Convert SVG to PNG Data URI
      const pngBuffer = await sharp(Buffer.from(data)).png().toBuffer();
      const base64String = pngBuffer.toString("base64");
      const dataUri = `data:image/png;base64,${base64String}`;

      return {
        fileName,
        svg: {
          filepath,
          dataUri,
        },
      };
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
      return null; // Skip this file if there's an error
    }
  });

  // Wait for all promises to resolve
  const resolvedSvgs = await Promise.all(svgPromises);

  // Populate `svgs` object
  resolvedSvgs.forEach((entry) => {
    if (entry) {
      svgs[entry.fileName] = entry.svg;
    }
  });

  // console.log("SVGs processed:", svgs);
};

// Initialize `svgs`
(async () => {
  await getSVGObjData();
})();

module.exports = {
  get svgs() {
    return svgs; // Ensure the latest version of `svgs` is returned
  },
  mdiSvg: (name) => {
    if (Object.keys(svgs).length === 0) {
      throw new Error("SVGs have not been loaded yet!");
    }
    // console.log("Current SVGs:", svgs);

    // Clean up scss argument
    const icons = name.toString().replace(/['"]+/g, "");

    // Fuzzy matching logic
    const matchingKey = Object.keys(svgs).find((key) =>
      key.toLowerCase().startsWith(icons.toLowerCase())
    );

    // Return the matched SVG or null if no match is found
    const svgPath = matchingKey ? svgs[matchingKey].filepath : null;
    const dataUri = matchingKey ? svgs[matchingKey].dataUri : null;

    const buildSassStr = (value) =>
      !value
        ? new SassString("", { quotes: false })
        : new SassString(value, { quotes: false });

    const svgValue = buildSassStr(svgPath);
    const pngValue = buildSassStr(dataUri);

    // if (!svg || !png) {
    //   throw new Error(`No matching SVG found for "${name}".`);
    // }

    const map = new Map([
      [new SassString(icons), svgValue],
      [new SassString(`${icons}-png`), pngValue],
    ]);

    return new SassMap(map);
  },
};
