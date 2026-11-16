import * as fs from 'node:fs';
import path from 'node:path';
import JSON5 from 'json5';
import type { FileOrder } from './options.js';

/**
 * Orders files the way `clasp push` does: entries listed in `.clasp.json`'s
 * `filePushOrder` come first (in that order), everything else follows sorted by path.
 */
export function sortFiles(files: string[], fileOrder: FileOrder = 'clasp', claspRoot: string = ''): string[] {
  const ordered: string[] = [];
  const remaining = new Set(files.map(f => path.resolve(f)));
  const root = path.resolve(process.cwd(), claspRoot);

  if (fileOrder === 'clasp') {
    const claspPath = path.join(root, '.clasp.json');
    if (!fs.existsSync(claspPath)) {
      console.warn(`TGAS-LOCAL: no .clasp.json at ${claspPath}, using filesystem load order`);
    } else {
      let filePushOrder: unknown;
      try {
        // clasp parses .clasp.json as JSON5 (comments, trailing commas, a leading BOM)
        filePushOrder = JSON5.parse(fs.readFileSync(claspPath, 'utf-8'))?.filePushOrder;
      } catch (err) {
        throw new Error(`TGAS-LOCAL: failed to parse ${claspPath}`, { cause: err });
      }
      if (filePushOrder !== undefined && !Array.isArray(filePushOrder)) {
        console.warn(`TGAS-LOCAL: filePushOrder in ${claspPath} is not an array, ignoring it`);
      }
      for (const relativePath of (Array.isArray(filePushOrder) ? filePushOrder : []) as unknown[]) {
        if (typeof relativePath !== 'string') {
          console.warn(`TGAS-LOCAL: ignoring non-string filePushOrder entry: ${JSON.stringify(relativePath)}`);
          continue;
        }
        const abs = path.resolve(root, relativePath);
        if (remaining.delete(abs)) {
          ordered.push(abs);
        } else if (!ordered.includes(abs)) {
          console.warn(`TGAS-LOCAL: filePushOrder entry not found: ${relativePath}`);
        }
      }
    }
  }

  // clasp sorts unlisted files with localeCompare
  const rest = [...remaining].sort((a, b) => a.localeCompare(b));
  return [...ordered, ...rest];
}
