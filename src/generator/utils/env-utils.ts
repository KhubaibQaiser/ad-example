import path from 'path';
import dotenv from 'dotenv';
import { config } from '../config';

export function loadEnv(publisher: string) {
  try {
    const envFilePath = path.resolve(config.rootDir, `.env.${publisher}`);
    dotenv.config({ path: envFilePath, override: true });
  } catch (error) {
    // Handle the error here
    console.error('Error loading environment variables:', error);
  }
}
