import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { loadConfig } from '../lib/config-loader';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();
const config = loadConfig();

new PipelineStack(app, 'EmbedsPipelineStack', {
  env: { account: '975050244567', region: 'us-east-1' },
  config: config,
  githubOrgName: 'shopsense-ai',
  repoName: 'embeds',
  branch: 'main'
})
