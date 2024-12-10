import { Stack, StackProps, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Config, ConfigEnvironment } from "./config-loader";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { S3CloudfrontStack } from "./s3-cloudfront-stack";

export type PipelineStackProps = StackProps & {
  config: Config
  githubOrgName: string
  repoName: string
  branch: string
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props)

    const pipeline = new CodePipeline(this, 'EmbedsPipeline', {
      pipelineName: 'EmbedsPipeline',
      crossAccountKeys: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection(
          `${props.githubOrgName}/${props.repoName}`,
          props.branch,
          {
            connectionArn: 'arn:aws:codestar-connections:us-west-2:975050244567:connection/4ac0747e-7f35-4db4-896d-aa9eb478872a',
          }
        ),
        commands: [
          'cd deployment',
          'npm install',
          'npm run build',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'deployment/cdk.out'
      }),
      selfMutation: true,
    })

    Object.keys(props.config.environments).forEach(key => {
      const configEnvironment = props.config.environments[key]

      pipeline.addStage(new BucketDeploymentStage(this, `${key}-BucketDeploymentStage`, {
        env: { account: configEnvironment.account, region: this.region },
        environment: key,
        configEnvironment: configEnvironment
      }))
    })
  }
}

type BucketDeploymentStageProps = StackProps & {
  environment: string,
  configEnvironment: ConfigEnvironment
}
class BucketDeploymentStage extends Stage {
  constructor(scope: Construct, id: string, props: BucketDeploymentStageProps) {
    super(scope, id, props)

    new S3CloudfrontStack(this, 'S3CloudfrontStack', {
      environment: props.environment,
      configEnvironment: props.configEnvironment
    })
  }
}
