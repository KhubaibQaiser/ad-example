// bin/app.js
import { App } from "aws-cdk-lib";
import { S3CloudfrontStack } from "./s3-cloudfront-stack.js";
import { loadConfig } from "./config-loader.js";

const app = new App();
const environment = process.env.CDK_ENV || "dev";
const config = loadConfig(environment);

// Example usage of the config
console.log("Loaded configuration:", {
  rootDomain: config.rootHostedZoneDomain,
  subdomain: config.hostedZoneSubdomain,
  delegationRole: config.zoneDelegation.delegationRoleName,
  delegationAccount: config.zoneDelegation.delegationAccount,
});

new S3CloudfrontStack(app, `EmbedS3Stack`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
    isProd: environment === "prod",
  },
  config: config,
});
