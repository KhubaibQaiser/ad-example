// config/environment.js
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function loadConfig(environment) {
  try {
    const configPath = path.join(__dirname, "./config.yaml");
    const configFile = fs.readFileSync(configPath, "utf8");
    const config = yaml.load(configFile);

    const envConfig = config.environments[environment];
    if (!envConfig) {
      throw new Error(`Environment ${environment} not found in config`);
    }

    return envConfig; // No need for case conversion anymore
  } catch (error) {
    console.error("Error loading configuration:", error);
    throw error;
  }
}
