import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import { minify, Options as HtmlMinifierOptions } from 'html-minifier';
import CleanCSS from 'clean-css';
import * as Terser from 'terser';

export function isImage(ext: string) {
  return ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.gif', '.svg', 'avif'].includes(ext.startsWith('.') ? ext : `.${ext}`);
}

// Function to read and render the template
export function renderTemplate(templatePath: string, data: unknown) {
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, { data, __dirname: path.dirname(templatePath) });
}

// Function to minify HTML
export function minifyHtml(html: string, moreOptions?: HtmlMinifierOptions) {
  return html;
  // return minify(html, {
  //   collapseWhitespace: true,
  //   removeComments: true,
  //   removeRedundantAttributes: true,
  //   removeScriptTypeAttributes: true,
  //   removeStyleLinkTypeAttributes: true,
  //   useShortDoctype: true,
  //   minifyJS: true,
  //   minifyCSS: true,
  //   ...(moreOptions || {}),
  // });
}

const cleanCss = new CleanCSS();
// Function to minify CSS
export function minifyCss(cssPath: string) {
  const css = fs.readFileSync(cssPath, 'utf-8');
  return cleanCss.minify(css).styles;
}

// Function to minify JS
export async function minifyJs(jsPath: string) {
  const js = fs.readFileSync(jsPath, 'utf-8');
  try {
    const result = await Terser.minify(js, {
      compress: {
        drop_console: true,
      },
    });
    if (!result) {
      throw new Error('Failed to minify JS');
    }
    return result.code ?? js;
  } catch (error) {
    console.error('Error during JS minification:', error);
    return js;
  }
}

export function getSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
