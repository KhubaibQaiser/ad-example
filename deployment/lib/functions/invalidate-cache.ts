import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

const cloudfront = new CloudFrontClient();

export const handler = async () => {
  const distributionId = process.env.DISTRIBUTION_ID;

  if (!distributionId) {
    throw new Error("DISTRIBUTION_ID environment variable is not set");
  }

  try {
    const invalidationParams = {
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: `s3-trigger-${Date.now()}`,
        Paths: {
          Quantity: 1,
          Items: ["/*"],
        },
      },
    };

    const command = new CreateInvalidationCommand(invalidationParams);
    await cloudfront.send(command);
    console.log(`Successfully created invalidation for distribution ${distributionId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Cache invalidation initiated successfully" }),
    };
  } catch (error) {
    console.error("Error creating invalidation:", error);
    throw error;
  }
};
