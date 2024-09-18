const fs = require('fs');
const ejs = require('ejs');
const { minify } = require('html-minifier');
const CleanCSS = require('clean-css');
const Terser = require('terser');
const path = require('path');
const fsExtra = require('fs-extra');
const sharp = require('sharp');

// Function to read and render the template
function renderTemplate(templatePath, data) {
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, { data: data, __dirname: path.dirname(templatePath) });
}

// Function to minify HTML
function minifyHtml(html) {
  return minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
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
async function processImages(inputDir, outputDir) {
  const entries = fs.readdirSync(inputDir, { withFileTypes: true });
  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      await fsExtra.ensureDir(outputPath);
      await processImages(inputPath, outputPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif', '.svg'].includes(ext)) {
        try {
          await sharp(inputPath)
            .resize(320) // Resize to a width of 320px, maintaining aspect ratio
            .webp({ quality: 80 }) // Convert to WebP format with 80% quality
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

// Main function to generate files
async function generateFiles() {
  const dataPath = path.join(__dirname, 'data', 'data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  const assetsDir = 'assets';
  updateAssetPaths(data, assetsDir);

  const outputRootDir = 'ads';
  const outputDir = path.join(__dirname, outputRootDir, data.slug);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const html = renderTemplate(path.join(__dirname, 'template', 'index.html'), data);
  const minifiedHtml = minifyHtml(html);
  fs.writeFileSync(path.join(outputDir, 'index.html'), minifiedHtml);

  const minifiedCss = minifyCss(path.join(__dirname, 'template', 'style.css'));
  fs.writeFileSync(path.join(outputDir, 'style.css'), minifiedCss);

  const minifiedJs = await minifyJs(path.join(__dirname, 'template', 'script.js'));
  fs.writeFileSync(path.join(outputDir, 'script.js'), minifiedJs);

  const templateAssetsDir = path.join(__dirname, 'template', 'assets');
  const outputAssetsDir = path.join(outputDir, 'assets');
  await fsExtra.ensureDir(outputAssetsDir);
  await processImages(templateAssetsDir, outputAssetsDir);

  const dataAssetsDir = path.join(__dirname, 'data', 'assets');
  if (fs.existsSync(dataAssetsDir)) {
    await processImages(dataAssetsDir, outputAssetsDir);
  }

  console.log(`Ad has been generated successfully in the '${outputRootDir}/${data.slug}' folder!`);
}

// Run the function
generateFiles();
