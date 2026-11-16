import type { GlobOptions, Path } from "glob"
import path from "node:path"
export type FileOrder = 'filesystem' | 'clasp'

export interface IGasOptions {
  /** filter out unwanted files from compilation esbuild ingestion */
  filter?: (file: string | Path) => boolean,
  /** Determines file load order
   * If omitted, will search for a clasp.json file order to use and default to filesystem order
  */
  fileOrder?: FileOrder,
  globOptions?: GlobOptions,
  /** root directory of the clasp.json file relative to the test process cwd */
  claspJsonRoot?: string
}

function filter(file: string | Path) {
  const ext = path.extname(file.toString())
  return ext === '.ts' || ext === '.js' || ext === '.gs'
}

export const defaultOptions: IGasOptions = {
  filter
}
