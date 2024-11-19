/// <reference types="aws-sdk" />

declare namespace NodeJS {
  interface ProcessEnv {
    ENVIRONMENT: 'development' | 'production';
    AMPLITUDE_API_KEY: string;
    SUPABASE_KEY: string;
    SUPABASE_URL: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    S3_BUCKET: string;
  }
}
