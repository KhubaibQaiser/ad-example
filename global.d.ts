declare namespace NodeJS {
  interface ProcessEnv {
    ENVIRONMENT: 'development' | 'production';
    AMPLITUDE_API_KEY: string;
    SUPABASE_KEY: string;
    SUPABASE_URL: string;
  }
}
