'use server';

import path from 'path';
import fs from 'fs';
import { config } from '@/generator/config';

export async function getExistingAds() {
  const adsDir = path.join(config.rootDir, 'public', 'ads');
  const supportedTemplates = [config.supportedTemplates['carousel-template'], config.supportedTemplates['curated-products-template']];
  if (!fs.existsSync(adsDir)) {
    return [];
  }

  const folders = fs.readdirSync(adsDir).map((file) => {
    const isDir = fs.statSync(path.join(adsDir, file)).isDirectory();
    if (!isDir) {
      return [];
    }
    const adFolders = [];
    for (const template of supportedTemplates) {
      const templateDir = path.join(adsDir, file, template, 'index.html');
      if (fs.existsSync(templateDir)) {
        const relativePath = templateDir.split('public')[1];

        adFolders.push({
          name: relativePath.replace('ads/', '').replace('/index.html', '').slice(1),
          url: relativePath,
        });
      }
    }
    return adFolders;
  });

  const flatFolders = folders.flat();

  const urls = flatFolders.map((folder) => folder);
  return urls;
}
