const fs = require('fs');
const ejs = require('ejs');
const { minify } = require('html-minifier');
const CleanCSS = require('clean-css');
const Terser = require('terser');
const path = require('path');
const fsExtra = require('fs-extra');
const sharp = require('sharp');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
  .option('width', {
    alias: 'w',
    type: 'number',
    description: 'Width for the ad unit',
    default: 160,
  })
  .option('height', {
    alias: 'h',
    type: 'number',
    description: 'Height for the ad unit',
    default: 600,
  })
  .option('quality', {
    alias: 'q',
    type: 'number',
    description: 'Quality for image compression',
    default: 80,
  }).argv;

const imageWidth = argv.width * 1.9;

// Function to read and render the template
function renderTemplate(templatePath, data) {
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, { data: data, __dirname: path.dirname(templatePath) });
}

// Function to minify HTML
function minifyHtml(html, moreOptions = {}) {
  return minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    ...moreOptions,
  });
}

// Function to minify CSS
function minifyCss(cssPath) {
  const css = fs.readFileSync(cssPath, 'utf-8');
  return new CleanCSS().minify(css).styles;
}

// Function to minify JS
async function minifyJs(jsPath) {
  const js = fs.readFileSync(jsPath, 'utf-8');
  try {
    const result = await Terser.minify(js);
    if (result.error) {
      throw result.error;
    }
    return result.code;
  } catch (error) {
    console.error('Error during JS minification:', error);
    return js; // Fallback to original JS if minification fails
  }
}

// Function to process images
async function processImages(inputDir, outputDir, width, quality) {
  const entries = fs.readdirSync(inputDir, { withFileTypes: true });
  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      await fsExtra.ensureDir(outputPath);
      await processImages(inputPath, outputPath, width, quality);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif', '.svg'].includes(ext)) {
        try {
          await sharp(inputPath)
            .resize(width) // Resize to the specified width, maintaining aspect ratio
            .webp({ quality }) // Convert to WebP format with the specified quality
            .toFile(outputPath.replace(ext, '.webp'));
        } catch (error) {
          console.error(`Error processing file ${inputPath}:`, error);
        }
      } else {
        console.warn(`Unsupported file format: ${inputPath}`);
      }
    }
  }
}

// Function to update asset paths in data.json
function updateAssetPaths(data, assetsDir) {
  const updatePaths = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].startsWith(assetsDir)) {
        obj[key] = obj[key].replace(/\.(jpg|jpeg|png|tiff|gif|svg)$/i, '.webp');
      } else if (typeof obj[key] === 'object') {
        updatePaths(obj[key]);
      }
    }
  };
  updatePaths(data);
}

// Main function to generate ads
async function generateAd() {
  try {
    const dataPath = path.join(__dirname, 'data', 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const assetsDir = 'assets';
    updateAssetPaths(data, assetsDir);

    const outputRootDir = 'ads';
    const outputDir = path.join(__dirname, outputRootDir, data.slug, 'ad');
    await fsExtra.ensureDir(outputDir);

    const html = renderTemplate(path.join(__dirname, 'template', 'index.html'), data);
    const minifiedHtml = minifyHtml(html);
    fs.writeFileSync(path.join(outputDir, 'index.html'), minifiedHtml);

    const minifiedCss = minifyCss(path.join(__dirname, 'template', 'style.css'));
    fs.writeFileSync(path.join(outputDir, 'style.css'), minifiedCss);

    const minifiedJs = await minifyJs(path.join(__dirname, 'template', 'script.js'));
    fs.writeFileSync(path.join(outputDir, 'script.js'), minifiedJs);

    const minifiedAmplitudeWrapperJs = await minifyJs(path.join(__dirname, 'template', 'amplitude-wrapper.js'));
    fs.writeFileSync(path.join(outputDir, 'amplitude-wrapper.js'), minifiedAmplitudeWrapperJs);

    const minifiedAmplitudeJs = await minifyJs(path.join(__dirname, 'template', 'amplitude.js'));
    fs.writeFileSync(path.join(outputDir, 'amplitude.js'), minifiedAmplitudeJs);

    const templateAssetsDir = path.join(__dirname, 'template', 'assets');
    const outputAssetsDir = path.join(outputDir, 'assets');
    await fsExtra.ensureDir(outputAssetsDir);
    await processImages(templateAssetsDir, outputAssetsDir, imageWidth * 0.9, argv.quality);

    const dataAssetsDir = path.join(__dirname, 'data', 'assets');
    if (fs.existsSync(dataAssetsDir)) {
      await processImages(dataAssetsDir, outputAssetsDir, imageWidth, argv.quality);
    }

    // Copy all files from the global folder to the output directory
    const globalDir = path.join(__dirname, 'global');
    if (fs.existsSync(globalDir)) {
      await fsExtra.copy(globalDir, outputDir);
    }

    // Copy ad.html to the output directory root and rename it to index.html
    const adHtml = renderTemplate(path.join(__dirname, 'ad.html'), { width: argv.width, height: argv.height });
    const minifiedAdHtml = minifyHtml(adHtml, { minifyCSS: true });
    fs.writeFileSync(path.join(outputRootDir, data.slug, 'index.html'), minifiedAdHtml);

    console.log(`Ad has been generated successfully in the '${outputRootDir}/${data.slug}' folder!`);

    // Dynamically import 'open' and open the generated index.html file
    const { default: open } = await import('open');
    await open(path.join(outputRootDir, data.slug, 'index.html'));
  } catch (error) {
    console.error('Error generating files:', error);
  }
}

// Run the function
generateAd();
