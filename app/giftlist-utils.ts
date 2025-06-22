import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export type Gift = {
  Objets: string;
  Références: string;
  prix: string;
  image: string;
};

export function getGifts(): Gift[] {
  const filePath = path.join(process.cwd(), 'LN.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records;
}
