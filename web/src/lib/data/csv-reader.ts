import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'data');

const cache = new Map<string, Record<string, string>[]>();

/**
 * RFC 4180 準拠の CSV 行パーサー
 * ダブルクォートで囲まれたフィールド内のカンマ・エスケープ済みクォートに対応
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }

  fields.push(current);
  return fields;
}

/**
 * CSV ファイルを読み込み、ヘッダー行をキーとしたオブジェクト配列を返す
 * ビルド時のみ使用（fs.readFileSync）。結果はメモ化される
 */
export function readCsv<T extends Record<string, string>>(
  filename: string,
): T[] {
  const cached = cache.get(filename);
  if (cached) return cached as T[];

  const filepath = join(DATA_DIR, filename);
  const content = readFileSync(filepath, 'utf-8');
  const lines = content.split(/\r?\n/).filter((line) => line !== '');

  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]);
  const result = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = values[i] ?? '';
    }
    return obj as T;
  });

  cache.set(filename, result);
  return result;
}
