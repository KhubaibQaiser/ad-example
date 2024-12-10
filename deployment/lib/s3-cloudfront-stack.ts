import { Stack, CfnOutput, StackProps } from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { ConfigEnvironment } from "./config-loader";
import { CrossAccountZoneDelegationRecord, PublicHostedZone } from "aws-cdk-lib/aws-route53";
import { Certificate, CertificateValidation } from "aws-cdk-lib/aws-certificatemanager";
import { Role } from "aws-cdk-lib/aws-iam";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";

export type S3CloudfronStackProps = StackProps & {
  environment: string,
  configEnvironment: ConfigEnvironment,
}

export class S3CloudfrontStack extends Stack {
  readonly bucket: s3.Bucket

  constructor(scope: Construct, id: string, props: S3CloudfronStackProps) {
    super(scope, id, props);

    // Create S3 bucket
    this.bucket = new s3.Bucket(this, "EmbedsBucket", {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new BucketDeployment(this, 'DeployEmbeds', {
      sources: [Source.asset(`embeds/${props.environment}`)],
      destinationBucket: this.bucket
    })

    new CfnOutput(this, "BucketName", { value: this.bucket.bucketName });

    const configEnvironment = props.configEnvironment
    const hostedZoneDomain = `${configEnvironment.hostedZoneSubdomain}.${configEnvironment.rootHostedZoneDomain}`;

    // Create hosted zone
    const hostedZone = new PublicHostedZone(this, "HostedZone", {
      zoneName: hostedZoneDomain,
    });

    const certificate = new Certificate(this, "Certificate", {
      domainName: hostedZoneDomain,
      validation: CertificateValidation.fromDns(hostedZone),
    });

    const delegationZoneArn = this.formatArn({
      account: configEnvironment.zoneDelegation.delegationAccount,
      service: "iam",
      resource: "role",
      resourceName: configEnvironment.zoneDelegation.delegationRoleName,
    });

    const delegationRole = Role.fromRoleArn(
      this,
      "DelegationRole",
      delegationZoneArn
    );

    new CrossAccountZoneDelegationRecord(
      this,
      "CrossAccountZoneDelegationRecord",
      {
        delegationRole,
        parentHostedZoneName: configEnvironment.rootHostedZoneDomain,
        delegatedZone: hostedZone
      }
    );

    // Create CloudFront distribution
    const distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        responseHeadersPolicy: new cloudfront.ResponseHeadersPolicy(this, 'AlloCORSHeaders', {
          corsBehavior: {
            accessControlAllowOrigins: ['*'],
            accessControlAllowHeaders: ['*'],
            accessControlAllowCredentials: false,
            accessControlAllowMethods: ['GET', 'HEAD', 'OPTION'],
            originOverride: true,
          }
        })
      },
      defaultRootObject: "index.html",
      domainNames: [hostedZoneDomain],
      certificate: certificate,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: "/error.html",
        },
      ],
    });

    new route53.ARecord(this, "AliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(distribution)
      ),
      recordName: "Embeds CDN",
    });

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });
    new CfnOutput(this, "DistributionDomain", {
      value: distribution.distributionDomainName,
    });
    new CfnOutput(this, "HostedZoneId", {
      value: hostedZone.hostedZoneId,
    });
  }
}
