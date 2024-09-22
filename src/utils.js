const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const { minify } = require('html-minifier');
const CleanCSS = require('clean-css');
const Terser = require('terser');

function isImage(ext) {
  return ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif', '.svg'].includes(ext.startsWith('.') ? ext : `.${ext}`);
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
    const result = await Terser.minify(js, {
      compress: {
        drop_console: true,
      },
    });
    if (result.error) {
      throw result.error;
    }
    return result.code;
  } catch (error) {
    console.error('Error during JS minification:', error);
    return js; // Fallback to original JS if minification fails
  }
}

function getSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

module.exports = {
  isImage,
  renderTemplate,
  minifyHtml,
  minifyCss,
  minifyJs,
  getSlug,
};
