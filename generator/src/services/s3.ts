import AWS from 'aws-sdk';
import { PassThrough } from 'stream';
import { IncomingMessage } from 'http';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  region: process.env.AWS_REGION as string,
});

export async function uploadEmbedToS3(apiResponseStream: IncomingMessage, publisherName: string, fileName: string): Promise<string> {
  try {
    // Create a PassThrough stream to handle the streaming data
    const passThroughStream = new PassThrough();
    // Pipe the API response stream to the PassThrough stream
    apiResponseStream.pipe(passThroughStream);

    // Construct the S3 key using the publisher name and file name
    const s3Bucket = process.env.S3_BUCKET as string;
    const s3Key = `${publisherName}/${fileName}.zip`;

    // Upload the ZIP file stream to S3
    const params = {
      Bucket: s3Bucket,
      Key: s3Key,
      Body: passThroughStream,
      ContentType: 'application/zip',
    };
    await s3.upload(params).promise();
    console.log('File uploaded successfully to S3');

    // Return the URL of the uploaded file
    return `https://${s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
  } catch (error) {
    console.error('Error uploading the file:', error);
    throw new Error('File upload failed');
  }
}
