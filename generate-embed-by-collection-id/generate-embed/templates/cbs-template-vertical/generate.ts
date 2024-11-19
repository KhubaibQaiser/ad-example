import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';

import { TemplateGeneratorHandler } from '../../../shared/types';
import { compressAssets, copyFolderRecursive } from '../../helpers/file';
import { generatorConfig } from '../../config';
import { minifyCss, minifyHtml, minifyJs, renderTemplate } from '../../utils/generator.utils';

const generate: TemplateGeneratorHandler = async ({ data: _data, outputAdDir, templateDir, width }) => {
    try {
        let data = { ..._data };
        // Use only first since it's a single moduleData template
        data = { ...data, modules: data.modules.slice(0, 1) };

        console.log('Rendering template...', { data, outputAdDir, templateDir, width });

        const outputAdAssetsDir = path.join(outputAdDir, 'assets');
        await fsExtra.ensureDir(outputAdAssetsDir);

        await compressAssets(
            path.join(generatorConfig.tempDownloadDir, data.collection_handle),
            outputAdAssetsDir,
            width,
            true,
        );

        const html = renderTemplate(path.join(templateDir, 'index.html'), data);
        const minifiedHtml = await minifyHtml(html);
        fs.writeFileSync(path.join(outputAdDir, 'index.html'), minifiedHtml);

        const minifiedCss = minifyCss(path.join(templateDir, 'style.css'));
        fs.writeFileSync(path.join(outputAdDir, 'style.css'), minifiedCss);

        const minifiedJs = await minifyJs(path.join(templateDir, 'script.js'));
        fs.writeFileSync(path.join(outputAdDir, 'script.js'), minifiedJs);

        const minifiedAmplitudeJs = await minifyJs(path.join(templateDir, 'amplitude-tracking.js'));
        fs.writeFileSync(path.join(outputAdDir, 'amplitude-tracking.min.js'), minifiedAmplitudeJs);

        // Copy assets from the input template folder
        await copyFolderRecursive(path.join(templateDir, 'assets'), outputAdAssetsDir);
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }

    return true;
};

export default generate;
