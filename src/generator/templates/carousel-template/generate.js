import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';

import { processAssets } from '@/generator/modules/asset-compression';
import { minifyCss, minifyHtml, minifyJs, renderTemplate } from '@/generator/utils/generator-utils';
import { config } from '@/generator/config';

export default async function generate(_data, outputAdDir, templateDir, width) {
  const data = JSON.parse(JSON.stringify(_data));

  const outputAdAssetsDir = path.join(outputAdDir, 'assets');
  await fsExtra.ensureDir(outputAdAssetsDir);

  await processAssets(path.join(config.tempDownloadDir, data.collection_handle), outputAdAssetsDir, width);

  const html = renderTemplate(path.join(templateDir, 'index.html'), data);
  const minifiedHtml = await minifyHtml(html);
  fs.writeFileSync(path.join(outputAdDir, 'index.html'), minifiedHtml);

  const minifiedCss = minifyCss(path.join(templateDir, 'style.css'));
  fs.writeFileSync(path.join(outputAdDir, 'style.css'), minifiedCss);

  const minifiedJs = await minifyJs(path.join(templateDir, 'script.js'));
  fs.writeFileSync(path.join(outputAdDir, 'script.js'), minifiedJs);

  const minifiedAmplitudeJs = await minifyJs(path.join(templateDir, 'amplitude-tracking.js'));
  fs.writeFileSync(path.join(outputAdDir, 'amplitude-tracking.min.js'), minifiedAmplitudeJs);
}
