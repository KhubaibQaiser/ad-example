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
const dotenv = require('dotenv');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
// if (process.env.NODE_ENV === 'production') {
//   // Path to the local FFmpeg binary
//   const ffmpegPath = path.join(__dirname, 'lib', 'ffmpeg');
//   // Set the path to the FFmpeg binary
//   ffmpeg.setFfmpegPath(ffmpegPath);
// }

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
  })
  .option('compress-video', {
    alias: 'cv',
    type: 'boolean',
    description: 'Enable or disable video compression',
    default: false,
  })
  .option('store-handle', {
    alias: 'sh',
    type: 'string',
    description: 'Store handle',
    default: 'tastemade',
  })
  .option('collection-handle', {
    alias: 'ch',
    type: 'string',
    description: 'Store Collection handle',
    default: 'auimg',
  }).argv;

// Load environment variables
const isProduction = process.env.NODE_ENV === 'production';
const envFile = `.env.${isProduction ? 'production' : 'development'}`;
const storeHandleEnvFile = `.env.${argv['store-handle']}${isProduction ? '' : '.test'}`;

dotenv.config({ path: envFile });
dotenv.config({ path: storeHandleEnvFile });

// console.log('STORE ENV', process.env);

const currentStore = argv['store-handle'];
const currentCollectionHandle = argv['collection-handle'];
const imageWidth = argv.width;
const suggestionImageRatio = 0.4; // 64/160 - suggestion div size / ad unit size
const suggestionImageWidth = imageWidth * suggestionImageRatio * 1.5;
const compressVideos = argv['compress-video'];
const tempDownloadDir = path.join(__dirname, 'temp');

function isImage(ext) {
  return ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif', '.svg'].includes(ext.startsWith('.') ? ext : `.${ext}`);
}

async function fetchData() {
  if (process.env.STORE_URL) {
    console.log('Fetching data from store...');
    try {
      const response = await axios({
        method: 'get',
        url: `${process.env.STORE_URL}store/custom/store/superstore/super`,
      });

      const store = response.data.sub_stores.find((store) => store.handle === currentCollectionHandle);
      store.collections.forEach((collection) => {
        if (collection.moduleType === 'featureLook') {
          const data = {
            ...collection,
            collection_handle: store.handle,
            moduleData: collection.metadata.moduleData,
            metadata: undefined,
          };
          console.log('Storing data to file...');
          fs.writeFileSync(path.join(__dirname, 'data', 'data.json'), JSON.stringify(data));
          console.log('Data stored to file successfully!');
        }
      });
    } catch (error) {
      console.error('Error fetching data from store:', error);
      throw new Error('Error fetching data from store');
    }
  } else {
    console.error('STORE_URL not found in .env file');
    throw new Error('STORE_URL not found in .env file');
  }
}

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
    minifyJS: true,
    minifyCSS: true,
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

// Function to download and save files
async function downloadFile(url, outputPath) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    onDownloadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.group();
      console.log(`Downloading ${url}: ${percentCompleted}%`);
      console.groupEnd();
    },
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

function downloadAndPlaceAsset({ assetUrl, assetsDir, ext, assetName, outAssetName, downloadPromises }) {
  let extensionFromAsset = path.extname(assetUrl).toLowerCase();
  extensionFromAsset = extensionFromAsset.startsWith('.') ? extensionFromAsset.slice(1) : extensionFromAsset;
  extensionFromAsset = isImage(extensionFromAsset) ? 'webp' : extensionFromAsset;
  const extension = ext ?? extensionFromAsset;
  const downloadPath = path.join(tempDownloadDir, `${outAssetName ?? assetName}.${extension}`);
  downloadPromises.push(downloadFile(assetUrl, downloadPath));
  return path.join('assets', `${outAssetName ?? assetName}.${extension}`);
}

// Function to download and process assets
async function downloadAndProcessAssets(data, assetsDir) {
  await fsExtra.ensureDir(assetsDir);
  const downloadPromises = [];

  await fsExtra.ensureDir(tempDownloadDir);

  console.log('Downloading assets...');

  // Download and process image_url
  if (data.image_url) {
    data.image_url = downloadAndPlaceAsset({ assetUrl: data.image_url, assetName: 'main_image', assetsDir, downloadPromises });
  }

  // Download and process moduleData assets
  for (let i = 0; i < data.moduleData.length; i++) {
    const module = data.moduleData[i];

    if (module.srcURL) {
      module.srcURL = downloadAndPlaceAsset({
        assetUrl: module.srcURL,
        assetName: `asset_${module.media}_${i}`,
        assetsDir,
        downloadPromises,
      });
    }

    if (module.backdropUrl) {
      module.backdropUrl = downloadAndPlaceAsset({
        assetUrl: module.backdropUrl,
        assetName: `backdrop_${i}`,
        assetsDir,
        downloadPromises,
      });
    }

    for (let j = 0; j < module.products.length; j++) {
      const product = module.products[j];

      if (product.image) {
        product.image = downloadAndPlaceAsset({
          assetUrl: product.image,
          assetName: `product_${i}_${j}`,
          outAssetName: `product_${i}_${j}_w_${suggestionImageWidth}`,
          assetsDir,
          downloadPromises,
          ext: 'webp',
        });

        const handleBaseUrl = `${process.env.STORE_URL}/${data.collection_handle}/products/`;
        product.handle = `${handleBaseUrl}${product.handle}`;
      }
    }
  }

  await Promise.all(downloadPromises);
  console.log('Downloaded assets successfully!');
  console.log('Processing assets...');
  await processAssets(tempDownloadDir, assetsDir, imageWidth, argv.quality);
  console.log('Processed images successfully!');
}

async function processImageAsset(inputPath, outputPath, ext, width, quality) {
  try {
    // console.log('Compressing image: ', inputPath);
    await sharp(inputPath)
      .resize(width, undefined, { withoutEnlargement: true }) // Resize to the specified width, maintaining aspect ratio
      .webp({ quality }) // Convert to WebP format with the specified quality
      .toFile(outputPath.replace(ext, '.webp'));
    // console.log('Compressed image: ', outputPath.replace(ext, '.webp'));
  } catch (error) {
    console.error(`Error processing file ${inputPath}:`, error);
  }
}

function processVideoAsset(inputPath, outputPath, width) {
  if (!compressVideos) {
    // !Important: Video compression is not supported on servers without FFmpeg installed
    console.warn('Skipping video compression...');
    fs.copyFileSync(inputPath, outputPath);
    return;
  }
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .noAudio()
      .size(`${width}x?`) // Resize to the specified width, maintaining aspect ratio
      .videoBitrate('1000k') // Set video bitrate
      .outputOptions('-crf 35') // Set constant rate factor for quality
      .on('error', reject)
      .on('progress', (progress) => {
        console.log('Video Compression Progress:', progress.frames);
      })
      .on('end', () => {
        console.log('Video compression and resizing complete!', inputPath);
        resolve('Video compression and resizing complete!');
      })
      .run();
  });
}

// Function to process images
async function processAssets(inputDir, outputDir, _width, _quality) {
  const width = parseInt(_width);
  const quality = parseInt(_quality);

  const entries = fs.readdirSync(inputDir, { withFileTypes: true });
  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      await fsExtra.ensureDir(outputPath);
      await processAssets(inputPath, outputPath, width, quality);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      let w = width;
      if (inputPath.includes('_w_')) {
        w = inputPath.split('_w_')[1].split('.')[0];
        w = isNaN(parseInt(w)) ? width : parseInt(w);
      }
      if (isImage(ext)) {
        await processImageAsset(inputPath, outputPath, ext, w, quality);
      } else {
        // fs.copyFileSync(inputPath, outputPath);
        // console.warn(`Unsupported file format: ${inputPath}`);
        await processVideoAsset(inputPath, outputPath, w);
      }
    }
  }
}

function validateData(_d) {
  const schema = require(path.join(__dirname, 'data', 'schema.js'));
  const validationResult = schema.safeParse(_d);
  if (!validationResult.success) {
    console.error('Validation errors:', validationResult.error);
    // throw new Error(validationResult.error);
  }
}

async function copyGlobalFiles(outputDir) {
  // Copy all files from the global folder to the output directory
  const globalDir = path.join(__dirname, 'global');
  if (fs.existsSync(globalDir)) {
    const files = fs.readdirSync(globalDir);
    for (const file of files) {
      const filePath = path.join(globalDir, file);
      const outputFilePath = path.join(outputDir, file);
      let minifiedContent = await minifyJs(filePath);
      if (file === 'amplitude-wrapper.min.js') {
        minifiedContent = minifiedContent.replace('AMPLITUDE_API_KEY', process.env.AMPLITUDE_API_KEY);
        minifiedContent = minifiedContent.replace('ENV_PLACEHOLDER', process.env.NODE_ENV || 'development');
      }
      fs.writeFileSync(path.join(outputFilePath), minifiedContent);
    }
  }
}

function getSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Main function to generate ads
async function generateAd() {
  try {
    await fetchData();

    const dataPath = path.join(__dirname, 'data', 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    validateData(data);

    // const assetsDir = 'assets';
    // updateAssetPaths(data, assetsDir);

    const outputRootDir = 'ads';
    const slug = data.handle || getSlug(data.title);
    const outputDir = path.join(outputRootDir, slug, 'ad');
    await fsExtra.ensureDir(outputDir);

    const outputAssetsDir = path.join(outputDir, 'assets');

    await downloadAndProcessAssets(data, outputAssetsDir);

    const html = renderTemplate(path.join(__dirname, 'template', 'index.html'), data);
    const minifiedHtml = minifyHtml(html);
    fs.writeFileSync(path.join(outputDir, 'index.html'), minifiedHtml);

    const minifiedCss = minifyCss(path.join(__dirname, 'template', 'style.css'));
    fs.writeFileSync(path.join(outputDir, 'style.css'), minifiedCss);

    const minifiedJs = await minifyJs(path.join(__dirname, 'template', 'script.js'));
    fs.writeFileSync(path.join(outputDir, 'script.js'), minifiedJs);

    const minifiedAmplitudeJs = await minifyJs(path.join(__dirname, 'template', 'amplitude-tracking.js'));
    fs.writeFileSync(path.join(outputDir, 'amplitude-tracking.min.js'), minifiedAmplitudeJs);

    const templateAssetsDir = path.join(__dirname, 'template', 'assets');
    await fsExtra.ensureDir(templateAssetsDir);
    await fsExtra.ensureDir(outputAssetsDir);
    await processAssets(templateAssetsDir, outputAssetsDir, imageWidth, argv.quality);

    const dataAssetsDir = path.join(__dirname, 'data', 'assets');
    if (fs.existsSync(dataAssetsDir)) {
      await processAssets(dataAssetsDir, outputAssetsDir, imageWidth, argv.quality);
    }

    await copyGlobalFiles(outputDir);

    // Copy ad.html to the output directory root and rename it to index.html
    const adHtml = renderTemplate(path.join(__dirname, 'ad.html'), { width: argv.width, height: argv.height });
    const minifiedAdHtml = minifyHtml(adHtml);
    fs.writeFileSync(path.join(outputRootDir, slug, 'index.html'), minifiedAdHtml);

    console.log(`Ad has been generated successfully in the '${outputRootDir}/${slug}' folder!`);

    // Dynamically import 'open' and open the generated index.html file
    const { default: open } = await import('open');
    await open(path.join(outputRootDir, slug, 'index.html'));
  } catch (error) {
    console.error('Error generating files:', error);
  } finally {
    // Remove the temporary download directory
    console.log('Removing temporary download directory...');
    await fsExtra.remove(tempDownloadDir);
  }
}

// Run the function
generateAd();
