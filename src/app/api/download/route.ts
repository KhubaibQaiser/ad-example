import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { config } from '@/generator/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.query;
  const filePath = path.join(config.outputRootDir, file as string);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', `attachment; filename=${file}`);
    res.setHeader('Content-Type', 'application/zip');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
}
