import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Gift {
  id: string;
  Objets: string;
  prix: number;
  image: string;
  Références: string;
}

export function getGifts(): Gift[] {
  const filePath = path.join(process.cwd(), 'LN.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // Add an id to each gift using the object name as a base
  return records.map((record: any) => ({
    ...record,
    id: `gift_${record.Objets.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    prix: record.prix.toString(), // Ensure prix is a string if it comes from CSV
  }));
}
