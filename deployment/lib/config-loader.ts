import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";

export type ConfigEnvironment = {
  rootHostedZoneDomain: string
  hostedZoneSubdomain: string
  zoneDelegation: {
    delegationRoleName: string
    delegationAccount: string
  }
}

export type Config = {
  environments: {
    [key: string]: ConfigEnvironment
  }
}

export function loadConfig() {
  try {
    const configPath = path.join(__dirname, "../config.yaml");
    const configFile = fs.readFileSync(configPath, "utf8");
    return yaml.load(configFile) as Config;
  } catch (error) {
    console.error("Error loading configuration:", error);
    throw error;
  }
}
