// This API route handles the upload of files to an S3 bucket.
// It expects a POST request with a JSON body containing the following parameters:
// - file: The file to be uploaded (as a stream or buffer)
// - publisherName: The name of the publisher (used for S3 key)
// - fileName: The name of the file (used for S3 key)
//
// Example fetch call to use this API route:
// fetch('/api/upload-to-s3', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     file: <file>, // Replace <file> with the actual file object
//     publisherName: 'examplePublisher',
//     fileName: 'exampleFileName',
//   }),
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.error('Error:', error));

import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { uploadEmbedToS3 } from '@/services/s3';

export async function POST(request: NextRequest) {
  const { file, publisherName, fileName } = await request.json();

  // Validate input parameters
  if (!file || !publisherName || !fileName) {
    return NextResponse.json({ message: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const s3Url = await uploadEmbedToS3(file, publisherName, fileName);
    console.log('File uploaded to S3:', s3Url);
    return NextResponse.json({ message: 'File uploaded successfully', s3Url });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error uploading file to S3:', errorMessage);
    return NextResponse.json({ message: 'File upload failed', error: errorMessage }, { status: 500 });
  }
}
