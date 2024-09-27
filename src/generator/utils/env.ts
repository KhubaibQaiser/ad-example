import path from 'path';
import dotenv from 'dotenv';

export function loadEnv(publisher: string) {
  const envFilePath = path.resolve(process.cwd(), `.env.${publisher}`);
  dotenv.config({ path: envFilePath });
}
