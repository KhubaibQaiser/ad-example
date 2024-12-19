import fs from "fs";
import path from "path";
import fsExtra from "fs-extra";
import { config } from "./config";
import { getSlug, minifyCss, minifyHtml, minifyJs, renderTemplate } from "@/generator/utils/generator-utils";
import { formatPrice, getDiscountPercentage, showDiscount } from "@/generator/utils/price";
import generateCarousel from "./templates/carousel-template/generate";
import generateCuratedProduct from "./templates/curated-products-template/generate";
import generateBanner from "./templates/banner-template/generate";
import generateCBSVertical from "./templates/cbs-template-vertical/generate";
import { AdGenerationResponse } from "@/types";
import { FeatureLookCollectionAdDataType, FLMeta, GenerateTemplateHandler, TrackingPayloadType } from "./types";
import { downloadAssetsAndParseReferences } from "./modules/file";

const TEMPLATE_GENERATOR_MAP: Record<keyof typeof config.supportedTemplates, GenerateTemplateHandler> = {
  CarouselTemplate: generateCarousel,
  CuratedProductsTemplate: generateCuratedProduct,
  BannerTemplate: generateBanner,
  CBSVerticalTemplate: generateCBSVertical,
};

async function copyGlobalFiles(outputDir: string, tracking?: TrackingPayloadType): Promise<void> {
  const globalDir = path.join(process.cwd(), "src", "generator", "global");
  await fsExtra.ensureDir(globalDir);
  const files = fs.readdirSync(globalDir);
  for (const file of files) {
    const filePath = path.join(globalDir, file);
    const outputFilePath = path.join(outputDir, file);

    let minifiedContent = "";

    const ext = path.extname(file).toLowerCase();
    switch (ext) {
      case ".js":
        minifiedContent = await minifyJs(filePath);
        break;
      case ".css":
        minifiedContent = await minifyCss(filePath);
        break;
      case ".html":
        minifiedContent = await minifyHtml(fs.readFileSync(filePath, "utf-8"));
        break;
    }

    if (file === "amplitude-wrapper.min.js") {
      minifiedContent = minifiedContent.replace("{{AMPLITUDE_API_KEY}}", process.env.AMPLITUDE_API_KEY || "");
      minifiedContent = minifiedContent.replace("{{ENV_PLACEHOLDER}}", process.env.ENVIRONMENT || "development");

      if (tracking) {
        minifiedContent = minifiedContent.replace("{{AD_ID_PLACEHOLDER}}", tracking.ad_id || "");
        minifiedContent = minifiedContent.replace("{{CAMPAIGN_ID_PLACEHOLDER}}", tracking.campaign_id || "");
        if (tracking.utms) {
          const utmKeys = Object.keys(tracking.utms) as (keyof typeof tracking.utms)[];
          utmKeys.forEach((key) => {
            minifiedContent = minifiedContent.replace(`{{${key.toUpperCase()}_PLACEHOLDER}}`, tracking.utms[key] || "");
          });
        }
      }
    }
    fs.writeFileSync(outputFilePath, minifiedContent);
  }
}

export async function generateAd(
  remoteData: FeatureLookCollectionAdDataType[],
  template: keyof typeof config.supportedTemplates,
  width: number,
  height: number,
  tracking?: TrackingPayloadType,
  meta?: FLMeta
) {
  const flData = await downloadAssetsAndParseReferences(remoteData);

  console.log("Generating ad...", { flData, template, width, height, tracking, meta });
  let outputAdRootDir = "";

  const templatesDir = path.join(process.cwd(), "src", "generator", "templates");
  const templateDirName = config.supportedTemplates[template as keyof typeof config.supportedTemplates];
  const templateDir = path.join(templatesDir, templateDirName);

  await fsExtra.ensureDir(config.tempDownloadDir);
  await fsExtra.ensureDir(config.outputRootDir);
  const adsPromises: Promise<AdGenerationResponse>[] = [];
  flData.forEach((data) => {
    adsPromises.push(
      new Promise(async (resolve, reject) => {
        try {
          const slug = data.collection_handle ?? getSlug(data.title);
          outputAdRootDir = path.join(config.outputRootDir, slug, templateDirName);
          if (fs.existsSync(outputAdRootDir)) {
            await fsExtra.remove(outputAdRootDir);
          }
          await fsExtra.ensureDir(outputAdRootDir);
          const outputAdDir = path.join(outputAdRootDir, "ad");
          await fsExtra.ensureDir(outputAdDir);
          const generateAd = TEMPLATE_GENERATOR_MAP[template as keyof typeof TEMPLATE_GENERATOR_MAP];
          await generateAd({ ...data, meta, utils: { formatPrice, showDiscount, getDiscountPercentage } }, outputAdDir, templateDir, width);
          await copyGlobalFiles(outputAdDir, tracking);
          const adHtml = renderTemplate(path.join(templatesDir, "ad.html"), { title: data.title, width, height });
          const minifiedAdHtml = await minifyHtml(adHtml);
          const adIndexPath = path.join(outputAdRootDir, "index.html");
          fs.writeFileSync(adIndexPath, minifiedAdHtml);
          const responseMessage = `Ad has been generated successfully!`;
          const relativePath = path.relative(process.cwd(), adIndexPath).replace("public/", "");
          resolve({ message: responseMessage, slug, template, outputPath: relativePath } as AdGenerationResponse);
        } catch (error) {
          console.error("Error generating ad:", error);
          reject({ message: `Error generating ad: ${template}`, error });
        }
      })
    );
  });

  const adsGenerationResponse = await Promise.all(adsPromises);
  return adsGenerationResponse;
}
