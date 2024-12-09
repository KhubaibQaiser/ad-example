// lib/s3-cloudfront-stack.js
import { Stack, CfnOutput } from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as iam from "aws-cdk-lib/aws-iam";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export class S3CloudfrontStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const config = props.config;
    const hostedZoneDomain = `${config.hostedZoneSubdomain}.${config.rootHostedZoneDomain}`;

    // Create S3 bucket
    const bucket = new s3.Bucket(this, "EmbedsBucket", {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Create hosted zone
    const hostedZone = new route53.PublicHostedZone(this, "HostedZone", {
      zoneName: hostedZoneDomain,
    });

    // Handle zone delegation
    if (config.zoneDelegation) {
      const delegationZoneArn = this.formatArn({
        account: config.zoneDelegation.delegationAccount,
        region: "",
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
          delegatedZone: hostedZone,
          delegationRoleName: config.zoneDelegation.delegationRoleName,
        }
      );
    }

    // Create CDN record
    if (config.cdn) {
      new route53.CnameRecord(this, "CdnCnameRecord", {
        zone: hostedZone,
        recordName: config.cdn.domain,
        domainName: config.cdn.rootCdnDomain,
      });
    }
    const certificate = new acm.Certificate(this, "Certificate", {
      domainName: hostedZoneDomain,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
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

    new route53.ARecord(this, "AliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(distribution)
      ),
      recordName: "",
    });

    // Outputs
    new CfnOutput(this, "BucketName", { value: bucket.bucketName });
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
