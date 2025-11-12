import type { GlobOptions, Path } from "glob"
import path from "node:path"
export {type GlobOptions, type Path}
export interface IGasOptions {
  filter?: (file: string | Path) => boolean,
  globOptions?: GlobOptions
}

function filter(file: string | Path) {
  const ext = path.extname(file.toString())
  return ext === '.ts' || ext === '.js' || ext === '.gs'
}

export const defaultOptions: IGasOptions = {
  filter
}
