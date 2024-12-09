import { Stack, CfnOutput, StackProps } from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as iam from "aws-cdk-lib/aws-iam";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";
import { ConfigEnvironment } from "./config-loader";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";

export type S3CloudfronStackProps = StackProps & {
  environment: string,
  configEnvironment: ConfigEnvironment
}

export class S3CloudfrontStack extends Stack {
  readonly bucket: s3.Bucket

  constructor(scope: Construct, id: string, props: S3CloudfronStackProps) {
    super(scope, id, props);

    const config = props.configEnvironment;
    const hostedZoneDomain = `${config.hostedZoneSubdomain}.${config.rootHostedZoneDomain}`;

    // Create S3 bucket
    this.bucket = new s3.Bucket(this, "EmbedsBucket", {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Handle zone delegation
    if (config.zoneDelegation) {
      // Create hosted zone
      const hostedZone = new route53.PublicHostedZone(this, "HostedZone", {
        zoneName: hostedZoneDomain,
      });

      const certificate = new acm.Certificate(this, "Certificate", {
        domainName: hostedZoneDomain,
        validation: acm.CertificateValidation.fromDns(hostedZone),
      });

      // Create CloudFront distribution
      const distribution = new cloudfront.Distribution(this, "Distribution", {
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
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

      const delegationZoneArn = this.formatArn({
        account: config.zoneDelegation.delegationAccount,
        region: "us-west-2",
        service: "iam",
        resource: "role",
        resourceName: config.zoneDelegation.delegationRoleName,
      });

      const delegationRole = iam.Role.fromRoleArn(
        this,
        "DelegationRole",
        delegationZoneArn
      );

      new route53.CrossAccountZoneDelegationRecord(
        this,
        "CrossAccountZoneDelegationRecord",
        {
          delegationRole,
          parentHostedZoneName: config.rootHostedZoneDomain,
          delegatedZone: hostedZone
        }
      );

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

    new BucketDeployment(this, 'DeployEmbeds', {
      sources: [Source.asset(`embeds/${props.environment}`)],
      destinationBucket: this.bucket
    })

    new CfnOutput(this, "BucketName", { value: this.bucket.bucketName });
  }
}
