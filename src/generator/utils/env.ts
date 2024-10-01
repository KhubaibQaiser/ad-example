import path from 'path';
import dotenv from 'dotenv';

export function loadEnv(publisher: string) {
  try {
    const envFilePath = path.resolve(process.cwd(), `.env.${publisher}`);
    dotenv.config({ path: envFilePath, override: true });
  } catch (error) {
    // Handle the error here
    console.error('Error loading environment variables:', error);
  }
}
